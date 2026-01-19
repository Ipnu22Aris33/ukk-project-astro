// DataTable.tsx
import { useState, useMemo } from "react";
import { Table, InputGroup, Form, Placeholder, Dropdown } from "react-bootstrap";

export interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  data: T[] | null;
  loading?: boolean;
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  showActions?: boolean;
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  minRows?: number;
}

function TableSkeleton({ columns = 6, minRows = 5 }: { columns?: number; minRows?: number }) {
  return (
    <Table bordered hover>
      <thead>
        <tr>
          <th style={{ width: '60px' }}>No</th>
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i}>
              <Placeholder animation="glow">
                <Placeholder xs={10} />
              </Placeholder>
            </th>
          ))}
          <th style={{ width: '100px' }}>Actions</th>
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
            <td>
              <Placeholder animation="glow">
                <Placeholder xs={10} />
              </Placeholder>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default function DataTable<T extends Record<string, any>>({
  data = null,
  loading = false,
  columns,
  searchable = true,
  searchPlaceholder = "Search...",
  showActions = true,
  onView,
  onEdit,
  onDelete,
  minRows = 5,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!search || !searchable) return data;

    const term = search.toLowerCase();
    return data.filter((item) =>
      columns.some((col) => {
        const val = item[col.key as keyof T];
        return String(val).toLowerCase().includes(term);
      })
    );
  }, [data, search, searchable, columns]);

  if (loading) {
    return (
      <div>
        {searchable && (
          <div className="mb-3">
            <InputGroup style={{ maxWidth: 320 }}>
              <InputGroup.Text>
                <i className="bi bi-search" />
              </InputGroup.Text>
              <Form.Control placeholder={searchPlaceholder} disabled />
            </InputGroup>
          </div>
        )}
        <TableSkeleton columns={columns.length} minRows={minRows} />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-4">No data available</div>;
  }

  const displayedData = filteredData.length > 0 ? filteredData : [];
  const emptyRows = Math.max(0, minRows - displayedData.length);

  return (
    <div>
      {searchable && (
        <div className="mb-3">
          <InputGroup style={{ maxWidth: 320 }}>
            <InputGroup.Text>
              <i className="bi bi-search" />
            </InputGroup.Text>
            <Form.Control
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </div>
      )}

      <div style={{ minHeight: minRows * 48 + 60 }}>
        <Table bordered hover style={{ tableLayout: 'fixed', minWidth: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>No</th>
              {columns.map((col) => (
                <th key={col.key as string} style={{ width: col.width }}>
                  {col.title}
                </th>
              ))}
              {showActions && <th style={{ width: '100px' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {displayedData.map((item, index) => (
              <tr key={index}>
                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                {columns.map((col) => (
                  <td key={col.key as string} style={{ verticalAlign: 'middle' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {col.render ? col.render(item[col.key], item) : item[col.key] || "-"}
                    </div>
                  </td>
                ))}
                {showActions && (
                  <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                    <Dropdown>
                      <Dropdown.Toggle size="sm" variant="light" className="border">
                        <i className="bi bi-three-dots" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {onView && <Dropdown.Item onClick={() => onView(item)}>View</Dropdown.Item>}
                        {onEdit && <Dropdown.Item onClick={() => onEdit(item)}>Edit</Dropdown.Item>}
                        {onDelete && (
                          <Dropdown.Item onClick={() => onDelete(item)} className="text-danger">
                            Delete
                          </Dropdown.Item>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                )}
              </tr>
            ))}

            {emptyRows > 0 && Array.from({ length: emptyRows }).map((_, i) => (
              <tr key={`empty-${i}`}>
                <td style={{ height: '48px', textAlign: 'center', verticalAlign: 'middle' }}>
                  {displayedData.length + i + 1}
                </td>
                {columns.map((col) => (
                  <td key={`empty-${String(col.key)}-${i}`} style={{ height: '48px', verticalAlign: 'middle' }} />
                ))}
                {showActions && (
                  <td style={{ height: '48px', verticalAlign: 'middle' }} />
                )}
              </tr>
            ))}

            {displayedData.length === 0 && emptyRows === 0 && (
              <tr>
                <td colSpan={columns.length + 2} className="text-center py-5">
                  {search ? "No results found" : "No data available"}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {displayedData.length > 0 && (
        <div className="text-muted small mt-2">
          Showing {displayedData.length} of {data.length} records
        </div>
      )}
    </div>
  );
}