// DataTable.tsx
import { useState, useMemo, useRef, useEffect } from "react";
import { Table, InputGroup, Form, Placeholder, Button, Pagination, OverlayTrigger, Tooltip, Dropdown } from "react-bootstrap";

export interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, item: T) => React.ReactNode;
  width?: number | string;
  minWidth?: number | string;
}

export interface ActionItem {
  label: string;
  icon?: string;
  onClick: (item: any) => void;
  variant?: "primary" | "danger" | "warning" | "success" | "info";
  show?: (item: any) => boolean;
  // Untuk dropdown
  dropdown?: ActionItem[];
}

export interface ActionConfig<T> {
  show?: boolean;
  items?: ActionItem[];
  position?: "end" | "start";
  maxVisible?: number; // Max action buttons sebelum jadi dropdown
}

interface DataTableProps<T> {
  data: T[] | null | undefined;
  loading?: boolean;
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  actions?: ActionConfig<T>;
  addButton?: {
    label: string;
    onClick: () => void;
    icon?: string;
    variant?: "primary" | "success" | "outline-primary";
  };

  // Row Limiting dengan Scroll
  maxRows?: number; // Max baris yang ditampilkan, sisanya bisa di-scroll
  fixedHeight?: boolean; // Table dengan height fixed
  tableHeight?: string; // Height custom jika fixedHeight true

  // Pagination (optional)
  pagination?: boolean;
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

function TableSkeleton({
  columns = 6,
  showActions = true,
  showAddButton = false,
  showPagination = false,
}: {
  columns?: number;
  minRows?: number;
  showActions?: boolean;
  showAddButton?: boolean;
  showPagination?: boolean;
}) {
  return (
    <div className="d-flex flex-column" style={{ minHeight: "400px" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="ms-auto">
          {showAddButton && (
            <Placeholder animation="glow" style={{ width: "150px" }}>
              <Placeholder xs={10} />
            </Placeholder>
          )}
        </div>
      </div>

      <div className="flex-grow-1">
        <div className="table-responsive">
          <Table striped hover className="mb-0">
            <thead>
              <tr>
                <th style={{ width: "60px" }} className="text-center">No</th>
                {Array.from({ length: columns }).map((_, i) => (
                  <th key={i} className="text-center">
                    <Placeholder animation="glow">
                      <Placeholder xs={10} />
                    </Placeholder>
                  </th>
                ))}
                {showActions && <th style={{ width: "100px" }} className="text-center">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="text-center">
                    <Placeholder animation="glow">
                      <Placeholder xs={6} />
                    </Placeholder>
                  </td>
                  {Array.from({ length: columns }).map((__, j) => (
                    <td key={j} className="text-center">
                      <Placeholder animation="glow">
                        <Placeholder xs={10} />
                      </Placeholder>
                    </td>
                  ))}
                  {showActions && (
                    <td className="text-center">
                      <Placeholder animation="glow">
                        <Placeholder xs={8} />
                      </Placeholder>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {showPagination && (
        <div className="mt-3">
          <Placeholder animation="glow" style={{ width: "300px" }}>
            <Placeholder xs={10} />
          </Placeholder>
        </div>
      )}
    </div>
  );
}

// Actions Component dengan Dropdown support
function DefaultActions<T>({ item, actions }: { item: T; actions: ActionConfig<T> }) {
  const { items = [], maxVisible = 2 } = actions;
  
  if (!items || items.length === 0) return null;

  // Filter actions yang visible
  const visibleActions = items.filter(action => 
    action.show === undefined || action.show(item)
  );

  if (visibleActions.length === 0) return null;

  // Actions yang punya dropdown
  const dropdownActions = visibleActions.filter(action => action.dropdown);
  
  // Actions biasa
  const regularActions = visibleActions.filter(action => !action.dropdown);
  
  // Tentukan apakah perlu dropdown untuk regular actions
  const showActionsDropdown = regularActions.length > maxVisible;
  const visibleRegularActions = showActionsDropdown 
    ? regularActions.slice(0, maxVisible - 1) 
    : regularActions;
  const hiddenRegularActions = showActionsDropdown 
    ? regularActions.slice(maxVisible - 1) 
    : [];

  return (
    <div className="d-flex justify-content-center gap-1" style={{ minWidth: "100px" }}>
      {/* Regular actions yang visible */}
      {visibleRegularActions.map((action, index) => (
        <OverlayTrigger
          key={index}
          placement="top"
          overlay={<Tooltip id={`tooltip-${index}`}>{action.label}</Tooltip>}
        >
          <Button
            size="sm"
            variant={action.variant || "outline-primary"}
            onClick={() => action.onClick(item)}
            className="d-flex align-items-center justify-content-center"
            style={{ width: "32px", height: "32px" }}
          >
            {action.icon && <i className={`bi ${action.icon}`} />}
            {!action.icon && <span>{action.label.charAt(0)}</span>}
          </Button>
        </OverlayTrigger>
      ))}

      {/* Dropdown untuk actions yang punya submenu */}
      {dropdownActions.map((action, index) => (
        <Dropdown key={`dropdown-${index}`} className="d-inline-block">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-dropdown-${index}`}>{action.label}</Tooltip>}
          >
            <Dropdown.Toggle
              size="sm"
              variant={action.variant || "outline-secondary"}
              className="d-flex align-items-center justify-content-center"
              style={{ width: "32px", height: "32px" }}
            >
              {action.icon && <i className={`bi ${action.icon}`} />}
              {!action.icon && <i className="bi bi-three-dots" />}
            </Dropdown.Toggle>
          </OverlayTrigger>
          <Dropdown.Menu>
            {action.dropdown?.map((subAction, subIndex) => (
              (subAction.show === undefined || subAction.show(item)) && (
                <Dropdown.Item
                  key={subIndex}
                  onClick={() => subAction.onClick(item)}
                  className="d-flex align-items-center"
                >
                  {subAction.icon && <i className={`bi ${subAction.icon} me-2`} />}
                  {subAction.label}
                </Dropdown.Item>
              )
            ))}
          </Dropdown.Menu>
        </Dropdown>
      ))}

      {/* Dropdown untuk hidden regular actions */}
      {showActionsDropdown && hiddenRegularActions.length > 0 && (
        <Dropdown className="d-inline-block">
          <Dropdown.Toggle
            size="sm"
            variant="outline-secondary"
            className="d-flex align-items-center justify-content-center"
            style={{ width: "32px", height: "32px" }}
          >
            <i className="bi bi-three-dots" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {hiddenRegularActions.map((action, index) => (
              <Dropdown.Item
                key={`more-${index}`}
                onClick={() => action.onClick(item)}
                className="d-flex align-items-center"
              >
                {action.icon && <i className={`bi ${action.icon} me-2`} />}
                {action.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )}
    </div>
  );
}

export default function DataTable<T extends Record<string, any>>({
  data = null,
  loading = false,
  columns,
  searchable = true,
  searchPlaceholder = "Search...",
  actions = {},
  addButton,

  // Row Limiting dengan Scroll
  maxRows = 10, // Default 10 rows, sisanya scroll
  fixedHeight = true, // Table dengan height fixed
  tableHeight = "400px", // Default height

  // Vertical Pagination
  pagination = false,
  pageSize = 10,
  currentPage = 1,
  onPageChange = () => {},
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [internalPage, setInternalPage] = useState(1);
  const tableRef = useRef<HTMLDivElement>(null);

  // Default actions config
  const actionsConfig: ActionConfig<T> = {
    show: true,
    position: "end",
    maxVisible: 2,
    ...actions,
  };

  // Filter data berdasarkan search
  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!search || !searchable) return data;

    const term = search.toLowerCase();
    return data.filter((item) =>
      columns.some((col) => {
        const val = item[col.key as keyof T];
        return String(val || "")
          .toLowerCase()
          .includes(term);
      }),
    );
  }, [data, search, searchable, columns]);

  // Vertical Pagination logic
  const usePage = pagination ? currentPage : internalPage;
  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPageSafe = Math.min(usePage, totalPages);

  // Data yang ditampilkan (tergantung pagination atau maxRows)
  let displayedData: T[] = [];
  let hasMoreRows = false;
  let rowCount = 0;

  if (pagination) {
    // Gunakan pagination
    displayedData = filteredData.slice(
      (currentPageSafe - 1) * pageSize,
      currentPageSafe * pageSize
    );
    hasMoreRows = filteredData.length > pageSize;
    rowCount = displayedData.length;
  } else {
    // Gunakan maxRows dengan scroll
    displayedData = filteredData.slice(0, maxRows);
    hasMoreRows = filteredData.length > maxRows;
    rowCount = Math.min(filteredData.length, maxRows);
  }

  const handlePageChange = (page: number) => {
    if (pagination && onPageChange) {
      onPageChange(page);
    } else {
      setInternalPage(page);
    }
  };

  // Reset page when search changes
  useEffect(() => {
    if (pagination && onPageChange) {
      onPageChange(1);
    } else {
      setInternalPage(1);
    }
  }, [search]);

  if (loading) {
    return (
      <TableSkeleton
        columns={columns.length}
        showActions={actionsConfig.show}
        showAddButton={!!addButton}
        showPagination={pagination}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-5" style={{ minHeight: "300px" }}>
        <div className="d-flex flex-column align-items-center justify-content-center h-100">
          <i className="bi bi-database-x fs-1 text-muted mb-3"></i>
          <h5 className="text-muted">No data available</h5>
          <p className="text-muted small">Add some data to get started</p>
          {addButton && (
            <Button variant="primary" size="sm" onClick={addButton.onClick} className="mt-3">
              <i className="bi bi-plus-lg me-1" />
              Add First Item
            </Button>
          )}
        </div>
      </div>
    );
  }

  const showActionsColumn = actionsConfig.show && actionsConfig.items && actionsConfig.items.length > 0;
  const hasSearchResults = search && filteredData.length === 0;
  
  // Calculate showing ranges
  const showingStartRow = pagination 
    ? (currentPageSafe - 1) * pageSize + 1 
    : 1;
  const showingEndRow = pagination 
    ? Math.min(currentPageSafe * pageSize, filteredData.length)
    : Math.min(maxRows, filteredData.length);

  return (
    <div className="d-flex flex-column" style={{ minHeight: "400px" }}>
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        {/* Search */}
        {searchable && (
          <InputGroup style={{ minWidth: "250px", flex: 1 }}>
            <InputGroup.Text>
              <i className="bi bi-search" />
            </InputGroup.Text>
            <Form.Control
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                handlePageChange(1);
              }}
            />
          </InputGroup>
        )}

        {/* Add Button */}
        {addButton && (
          <Button 
            variant={addButton.variant || "primary"} 
            onClick={addButton.onClick}
            className="ms-auto ms-md-0 d-flex align-items-center"
            size="sm"
          >
            {addButton.icon && <i className={`bi ${addButton.icon} me-1`} />}
            <span>{addButton.label}</span>
          </Button>
        )}
      </div>

      {/* Table Container */}
      <div className="flex-grow-1" ref={tableRef}>
        {hasSearchResults ? (
          // Empty search results
          <div className="d-flex flex-column align-items-center justify-content-center h-100 py-5">
            <i className="bi bi-search fs-1 text-muted mb-3"></i>
            <h5 className="text-muted mb-2">No results found</h5>
            <p className="text-muted small">
              No items matching "<strong>{search}</strong>"
            </p>
            <Button variant="outline-secondary" size="sm" onClick={() => setSearch("")} className="mt-3">
              Clear search
            </Button>
          </div>
        ) : (
          // Data Table dengan fixed height jika maxRows
          <div 
            className={`table-responsive rounded border ${fixedHeight ? 'overflow-auto' : ''}`}
            style={fixedHeight ? { height: tableHeight } : {}}
          >
            <Table striped hover className="mb-0" style={{ tableLayout: "fixed", width: "100%" }}>
              <thead style={{ position: "sticky", top: 0, backgroundColor: "white", zIndex: 1 }}>
                <tr>
                  <th style={{ width: "60px", minWidth: "60px" }} className="text-center">No</th>
                  {columns.map((col) => {
                    const colWidth = col.width || "auto";
                    const minWidth = col.minWidth || "100px";
                    
                    return (
                      <th 
                        key={col.key as string} 
                        style={{ 
                          width: colWidth,
                          minWidth: minWidth,
                          maxWidth: "300px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                        className="text-center"
                        title={col.title}
                      >
                        <div className="text-truncate px-2">{col.title}</div>
                      </th>
                    );
                  })}
                  {showActionsColumn && (
                    <th style={{ 
                      width: "120px", 
                      minWidth: "120px",
                      maxWidth: "150px"
                    }} className="text-center">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {displayedData.map((item, index) => (
                  <tr key={index}>
                    <td style={{ verticalAlign: "middle" }} className="text-center">
                      {showingStartRow + index}
                    </td>
                    {columns.map((col) => {
                      const cellContent = col.render 
                        ? col.render(item[col.key], item) 
                        : item[col.key] || "-";
                      
                      return (
                        <td 
                          key={col.key as string} 
                          style={{ 
                            verticalAlign: "middle",
                            maxWidth: "300px",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }} 
                          className="text-center px-2"
                          title={typeof cellContent === 'string' ? cellContent : undefined}
                        >
                          <div className="text-truncate">
                            {cellContent}
                          </div>
                        </td>
                      );
                    })}
                    {showActionsColumn && actionsConfig.items && (
                      <td style={{ verticalAlign: "middle" }} className="text-center px-2">
                        <DefaultActions item={item} actions={actionsConfig} />
                      </td>
                    )}
                  </tr>
                ))}

                {/* Indicator jika ada lebih banyak rows */}
                {!pagination && hasMoreRows && (
                  <tr>
                    <td colSpan={columns.length + 2} className="text-center py-3 text-muted bg-light">
                      <i className="bi bi-chevron-down me-1" />
                      {filteredData.length - maxRows} more rows available (scroll to see more)
                      <i className="bi bi-chevron-down ms-1" />
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {pagination && filteredData.length > 0 && (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 gap-2">
          <div className="text-muted small">
            Showing <strong>{showingStartRow}-{showingEndRow}</strong> of <strong>{filteredData.length}</strong> items
            {search && (
              <span className="ms-2">
                • Filtered by: "<strong>{search}</strong>"
              </span>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination className="mb-0">
              <Pagination.Prev 
                onClick={() => handlePageChange(currentPageSafe - 1)} 
                disabled={currentPageSafe === 1} 
              />
              
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5) {
                  if (currentPageSafe > 3) {
                    pageNum = currentPageSafe - 2 + i;
                    if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                  }
                }
                
                return (
                  <Pagination.Item 
                    key={pageNum} 
                    active={pageNum === currentPageSafe} 
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Pagination.Item>
                );
              })}
              
              <Pagination.Next 
                onClick={() => handlePageChange(currentPageSafe + 1)} 
                disabled={currentPageSafe === totalPages} 
              />
            </Pagination>
          )}
        </div>
      )}

      {/* Info Footer untuk mode maxRows (non-pagination) */}
      {!pagination && filteredData.length > 0 && (
        <div className="text-muted small mt-3 text-center text-md-start">
          Showing <strong>{rowCount}</strong> of <strong>{filteredData.length}</strong> items
          {hasMoreRows && (
            <span className="ms-2 text-warning">
              • Scroll to see {filteredData.length - maxRows} more rows
            </span>
          )}
          {search && (
            <span className="ms-2">
              • Filtered by: "<strong>{search}</strong>"
            </span>
          )}
        </div>
      )}
    </div>
  );
}