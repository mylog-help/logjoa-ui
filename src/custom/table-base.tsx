import { cn } from "../cn";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Checkbox } from "../ui/checkbox";

type TableColumn<T> = {
  key: string;
  header: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  align?: "right"; // 숫자 열 (표에서만, 카드는 무시)
};

// 행 타입은 소비처마다 달라 키 문자열로 값을 꺼낸다
const cellValue = (row: object, key: string): unknown => Reflect.get(row, key);

// render 없는 셀: React가 그대로 그릴 수 있는 값만 출력
const renderCell = (value: unknown): React.ReactNode =>
  typeof value === "string" || typeof value === "number" ? value : null;

interface TableBaseProps<T extends object> {
  tableFooter?: boolean;
  bordered?: boolean; // 테두리 + 회색 헤더 (/board 목록과 같은 모양)
  columns: TableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  // 일괄 편집 관련
  bulkEditMode?: boolean;
  selectedIds?: string[];
  onSelectRow?: (id: string) => void;
  onSelectAll?: (ids: string[]) => void;
  // md 미만에서 표 대신 카드 (첫 열 = 제목, 나머지 = 라벨·값)
  mobileCards?: boolean;
  // lg 이상에서 남은 높이를 채우고 표 안에서만 스크롤 (헤더 고정)
  fillHeight?: boolean;
}

export function TableBase<T extends object>({
  tableFooter = true,
  bordered = false,
  columns,
  data,
  onRowClick,
  bulkEditMode = false,
  selectedIds = [],
  onSelectRow,
  onSelectAll,
  mobileCards = false,
  fillHeight = false,
}: TableBaseProps<T>) {
  // 전체 선택 상태 계산
  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const someSelected =
    selectedIds.length > 0 && selectedIds.length < data.length;
  const cellContent = (column: TableColumn<T>, row: T) =>
    column.render
      ? column.render(cellValue(row, column.key), row)
      : renderCell(cellValue(row, column.key));
  const [titleColumn, ...detailColumns] = columns;
  return (
    <div
      className={cn(
        "flex h-full flex-col",
        fillHeight && "lg:min-h-0 lg:flex-1",
      )}
    >
      {mobileCards && (
        <div className="flex flex-col gap-2 md:hidden">
          {bulkEditMode && data.length > 0 && (
            <label className="flex items-center gap-2 px-1 text-sm">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) =>
                  onSelectAll?.(
                    checked
                      ? data.map((row) => String(cellValue(row, "id")))
                      : [],
                  )
                }
              />
              전체 선택
            </label>
          )}
          {data.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              표시할 데이터가 없습니다.
            </p>
          )}
          {data.map((row, index) => {
            const rowId = String(cellValue(row, "id"));
            return (
              <div
                key={index}
                className={cn(
                  "rounded-lg border bg-card p-3",
                  (bulkEditMode || onRowClick) &&
                    "cursor-pointer active:bg-muted",
                )}
                // 일괄 편집 중에는 카드 탭 = 선택
                onClick={() =>
                  bulkEditMode ? onSelectRow?.(rowId) : onRowClick?.(row)
                }
              >
                <div className="flex items-center gap-2">
                  {bulkEditMode && (
                    <Checkbox
                      checked={selectedIds.includes(rowId)}
                      onClick={(e) => e.stopPropagation()}
                      onCheckedChange={() => onSelectRow?.(rowId)}
                      aria-label="선택"
                    />
                  )}
                  {titleColumn && (
                    <div className="min-w-0 flex-1 truncate font-medium">
                      {cellContent(titleColumn, row)}
                    </div>
                  )}
                </div>
                {detailColumns.length > 0 && (
                  <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm sm:grid-cols-4">
                    {detailColumns.map((column) => (
                      <div key={column.key} className="min-w-0">
                        <dt className="text-xs text-muted-foreground">
                          {column.header}
                        </dt>
                        <dd className="truncate">{cellContent(column, row)}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 헤더·본문을 한 테이블로 — 분리하면 열 폭이 따로 계산돼 어긋남 */}
      <div
        className={cn(
          "h-full overflow-y-auto",
          bordered && "rounded-lg border",
          mobileCards && "hidden md:block",
          // 가로·세로 스크롤을 이 영역 하나로 — 표 래퍼가 스크롤 기준이 되면 헤더 고정이 안 됨
          fillHeight &&
            "lg:min-h-0 lg:flex-1 lg:overflow-auto lg:[&>[data-slot=table-container]]:overflow-visible",
        )}
      >
        <Table>
          <TableHeader
            className={cn(
              bordered && "bg-muted",
              fillHeight && "lg:sticky lg:top-0 lg:z-10",
            )}
          >
            <TableRow>
              {bulkEditMode && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onSelectAll?.(
                          data.map((row) => String(cellValue(row, "id"))),
                        );
                      } else {
                        onSelectAll?.([]);
                      }
                    }}
                    aria-label="전체 선택"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(column.align === "right" && "text-right")}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (bulkEditMode ? 1 : 0)}
                  className="h-32 text-center text-muted-foreground"
                >
                  표시할 데이터가 없습니다.
                </TableCell>
              </TableRow>
            )}
            {data.map((row, index) => {
              const rowId = String(cellValue(row, "id"));
              const isSelected = selectedIds.includes(rowId);
              return (
                <TableRow
                  key={index}
                  className={onRowClick ? "cursor-pointer hover:bg-muted" : ""}
                  onClick={() => {
                    if (!bulkEditMode) {
                      onRowClick && onRowClick(row);
                    }
                  }}
                >
                  {bulkEditMode && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onSelectRow?.(rowId)}
                        aria-label={`사용자 ${String(cellValue(row, "name"))} 선택`}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      key={`${index}-${column.key}`}
                      className={cn(column.align === "right" && "text-right")}
                    >
                      {column.render
                        ? column.render(cellValue(row, column.key), row)
                        : renderCell(cellValue(row, column.key))}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {tableFooter && bulkEditMode && (
        <div className="px-2 text-sm text-muted-foreground">
          {data.length}개 중 {selectedIds.length}개 선택됨
        </div>
      )}
    </div>
  );
}
