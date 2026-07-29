import useAuditLogs from "./hooks/useAuditLogs";
import AuditLogFilters from "./components/AuditLogFilters";
import AuditLogTable from "./components/AuditLogTable";

export default function AuditLogsPage() {
  const {
    logs,
    total,
    isLoading,
    search,
    setSearch,
    actionFilter,
    entityTypeFilter,
    statusFilter,
    actions,
    entityTypes,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    page,
    totalPages,
    limit,
    handleActionFilter,
    handleEntityTypeFilter,
    handleStatusFilter,
    setPage,
  } = useAuditLogs();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-bold sm:text-3xl">Audit Logs</h1>
        <p className="text-muted-foreground mt-1">
          Track all significant actions across the platform
        </p>
      </div>

      <div className="mb-6">
        <AuditLogFilters
          search={search}
          actionFilter={actionFilter}
          entityTypeFilter={entityTypeFilter}
          statusFilter={statusFilter}
          actions={actions}
          entityTypes={entityTypes}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onSearchChange={setSearch}
          onActionChange={handleActionFilter}
          onEntityTypeChange={handleEntityTypeFilter}
          onStatusChange={handleStatusFilter}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
        />
      </div>

      <AuditLogTable
        logs={logs}
        isLoading={isLoading}
        totalPages={totalPages}
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
      />
    </div>
  );
}
