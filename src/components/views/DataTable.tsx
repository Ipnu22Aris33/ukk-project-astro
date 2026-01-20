// DataTable.tsx
import { useState, useMemo } from "react";
import { Table, InputGroup, Form, Placeholder, Dropdown, Button, Pagination } from "react-bootstrap";

export interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
}

export interface ActionItem {
  label: string;
  icon?: string;
  onClick: (item: any) => void;
  variant?: "default" | "danger" | "warning" | "success";
}

export interface ActionConfig<T> {
  show?: boolean;
  items?: ActionItem[];
  dropdown?: boolean;
  position?: "end" | "start";
}

interface DataTableProps<T> {
  data: T[] | null;
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
  minRows?: number;
  title?: string;

  // Pagination props
  pagination?: boolean;
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

function TableSkeleton({
  columns = 6,
  minRows = 5,
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
    <div className="d-flex flex-column" style={{ minHeight: "500px" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Placeholder animation="glow" style={{ width: "300px" }}>
          <Placeholder xs={10} />
        </Placeholder>
        {showAddButton && (
          <Placeholder animation="glow" style={{ width: "150px" }}>
            <Placeholder xs={10} />
          </Placeholder>
        )}
      </div>

      <div className="flex-grow-1">
        <Table striped hover className="mb-0" >
          <thead>
            <tr>
              <th style={{ width: "60px" }}>No</th>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i}>
                  <Placeholder animation="glow">
                    <Placeholder xs={10} />
                  </Placeholder>
                </th>
              ))}
              {showActions && <th style={{ width: "100px" }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: minRows }).map((_, i) => (
              <tr key={i}>
                <td>
                  <Placeholder animation="glow">
                    <Placeholder xs={6} />
                  </Placeholder>
                </td>
                {Array.from({ length: columns }).map((__, j) => (
                  <td key={j}>
                    <Placeholder animation="glow">
                      <Placeholder xs={10} />
                    </Placeholder>
                  </td>
                ))}
                {showActions && (
                  <td>
                    <Placeholder animation="glow">
                      <Placeholder xs={10} />
                    </Placeholder>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
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

// Default actions component
function DefaultActions<T>({ item, actions }: { item: T; actions: ActionConfig<T> }) {
  const { items = [], dropdown = true } = actions;

  if (!items || items.length === 0) return null;

  if (dropdown) {
    return (
      <Dropdown>
        <Dropdown.Toggle size="sm" variant="light" className="border">
          <i className="bi bi-three-dots" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {items.map((action, index) => (
            <Dropdown.Item
              key={index}
              onClick={() => action.onClick(item)}
              className={action.variant === "danger" ? "text-danger" : ""}
            >
              {action.icon && <i className={`bi ${action.icon} me-2`} />}
              {action.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  return (
    <div className="btn-group" role="group">
      {items.map((action, index) => (
        <Button
          key={index}
          size="sm"
          variant="light"
          className={`border ${action.variant === "danger" ? "text-danger" : ""}`}
          onClick={() => action.onClick(item)}
          title={action.label}
        >
          {action.icon && <i className={`bi ${action.icon}`} />}
          {!action.icon && action.label}
        </Button>
      ))}
    </div>
  );
}

// Pagination Component
function DataTablePagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  showingStart,
  showingEnd,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  pageSize: number;
  showingStart: number;
  showingEnd: number;
}) {
  const maxVisiblePages = 5;

  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3">
      <div className="mb-2 mb-md-0">
        <span className="text-muted">
          Showing{" "}
          <strong>
            {showingStart}-{showingEnd}
          </strong>{" "}
          of <strong>{totalItems}</strong> items
        </span>
      </div>

      {totalPages > 1 && (
        <Pagination className="mb-0">
          <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />

          {currentPage > Math.floor(maxVisiblePages / 2) + 1 && (
            <>
              <Pagination.Item onClick={() => onPageChange(1)}>1</Pagination.Item>
              {currentPage > Math.floor(maxVisiblePages / 2) + 2 && <Pagination.Ellipsis disabled />}
            </>
          )}

          {getPageNumbers().map((page) => (
            <Pagination.Item key={page} active={page === currentPage} onClick={() => onPageChange(page)}>
              {page}
            </Pagination.Item>
          ))}

          {currentPage < totalPages - Math.floor(maxVisiblePages / 2) && (
            <>
              {currentPage < totalPages - Math.floor(maxVisiblePages / 2) - 1 && <Pagination.Ellipsis disabled />}
              <Pagination.Item onClick={() => onPageChange(totalPages)}>{totalPages}</Pagination.Item>
            </>
          )}

          <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        </Pagination>
      )}

      <div className="mt-2 mt-md-0">
        <span className="text-muted">
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>
      </div>
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
  minRows = 5,
  title,

  // Pagination
  pagination = false,
  pageSize = 10,
  currentPage = 1,
  onPageChange = () => {},
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [internalPage, setInternalPage] = useState(1);

  // Default actions config
  const actionsConfig: ActionConfig<T> = {
    show: true,
    dropdown: true,
    position: "end",
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

  // Pagination logic
  const usePage = pagination ? currentPage : internalPage;
  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPageSafe = Math.min(usePage, totalPages);

  const paginatedData = pagination
    ? filteredData.slice((currentPageSafe - 1) * pageSize, currentPageSafe * pageSize)
    : filteredData;

  const handlePageChange = (page: number) => {
    if (pagination && onPageChange) {
      onPageChange(page);
    } else {
      setInternalPage(page);
    }
  };

  // Reset to page 1 when search changes
  useState(() => {
    if (pagination && onPageChange) {
      onPageChange(1);
    } else {
      setInternalPage(1);
    }
  });

  if (loading) {
    return (
      <TableSkeleton
        columns={columns.length}
        minRows={minRows}
        showActions={actionsConfig.show}
        showAddButton={!!addButton}
        showPagination={pagination}
      />
    );
  }

  if (!data) {
    return (
      <div className="text-center py-5" style={{ minHeight: "400px" }}>
        <div className="d-flex flex-column align-items-center justify-content-center h-100">
          <i className="bi bi-database-x fs-1 text-muted mb-3"></i>
          <h5 className="text-muted">No data available</h5>
          <p className="text-muted small">Add some data to get started</p>
        </div>
      </div>
    );
  }

  const displayedData = paginatedData.length > 0 ? paginatedData : [];
  const emptyRows = Math.max(0, minRows - displayedData.length);
  const showActionsColumn = actionsConfig.show;
  const hasSearchResults = search && filteredData.length === 0;
  const noDataAtAll = !search && filteredData.length === 0;

  // Calculate showing range
  const showingStart = pagination && displayedData.length > 0 ? (currentPageSafe - 1) * pageSize + 1 : 1;
  const showingEnd = pagination ? Math.min(currentPageSafe * pageSize, filteredData.length) : filteredData.length;

  return (
    <div className="d-flex flex-column" style={{ minHeight: "500px" }}>
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Left: Search */}
        {searchable && (
          <InputGroup style={{ maxWidth: 320 }}>
            <InputGroup.Text>
              <i className="bi bi-search" />
            </InputGroup.Text>
            <Form.Control
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (pagination) {
                  onPageChange(1);
                } else {
                  setInternalPage(1);
                }
              }}
            />
          </InputGroup>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }}></div>

        {/* Right: Add Button */}
        {addButton && (
          <Button variant={addButton.variant || "primary"} onClick={addButton.onClick}>
            {addButton.icon && <i className={`bi ${addButton.icon} me-1`} />}
            {addButton.label}
          </Button>
        )}
      </div>

      {/* Table Container */}
      <div className="flex-grow-1">
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
        ) : noDataAtAll ? (
          // No data at all
          <div className="d-flex flex-column align-items-center justify-content-center h-100 py-5">
            <i className="bi bi-inbox fs-1 text-muted mb-3"></i>
            <h5 className="text-muted mb-2">No data available</h5>
            <p className="text-muted small">Add some data to get started</p>
            {addButton && (
              <Button variant="primary" size="sm" onClick={addButton.onClick} className="mt-3">
                <i className="bi bi-plus-lg me-1" />
                Add First Item
              </Button>
            )}
          </div>
        ) : (
          // Data Table
          <Table  striped hover className="mb-0" style={{ tableLayout: "fixed", minWidth: "100%" }}>
            <thead>
              <tr>
                <th style={{ width: "60px" }}>No</th>
                {columns.map((col) => (
                  <th key={col.key as string} style={{ width: col.width }}>
                    {col.title}
                  </th>
                ))}
                {showActionsColumn && <th style={{ width: "120px" }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {displayedData.map((item, index) => (
                <tr key={index}>
                  <td style={{ textAlign: "center", verticalAlign: "middle" }}>{showingStart + index}</td>
                  {columns.map((col) => (
                    <td key={col.key as string} style={{ verticalAlign: "middle" }}>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {col.render ? col.render(item[col.key], item) : item[col.key] || "-"}
                      </div>
                    </td>
                  ))}
                  {showActionsColumn && (
                    <td
                      style={{
                        textAlign: actionsConfig.position === "end" ? "end" : "start",
                        verticalAlign: "middle",
                      }}
                    >
                      <DefaultActions item={item} actions={actionsConfig} />
                    </td>
                  )}
                </tr>
              ))}

              {/* Empty rows for consistent height */}
              {emptyRows > 0 &&
                Array.from({ length: emptyRows }).map((_, i) => (
                  <tr key={`empty-${i}`}>
                    <td style={{ height: "48px", textAlign: "center", verticalAlign: "middle" }}>
                      {showingStart + displayedData.length + i}
                    </td>
                    {columns.map((col) => (
                      <td key={`empty-${String(col.key)}-${i}`} style={{ height: "48px", verticalAlign: "middle" }} />
                    ))}
                    {showActionsColumn && <td style={{ height: "48px", verticalAlign: "middle" }} />}
                  </tr>
                ))}
            </tbody>
          </Table>
        )}
      </div>

      {/* Pagination Footer */}
      {pagination && filteredData.length > 0 && (
        <DataTablePagination
          currentPage={currentPageSafe}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={filteredData.length}
          pageSize={pageSize}
          showingStart={showingStart}
          showingEnd={showingEnd}
        />
      )}

      {/* Simple Info Footer (non-pagination) */}
      {!pagination && filteredData.length > 0 && (
        <div className="text-muted small mt-3">
          Showing <strong>{filteredData.length}</strong> items
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
