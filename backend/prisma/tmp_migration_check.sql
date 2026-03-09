SELECT to_regclass('public.password_resets') AS password_resets_table;

SELECT migration_name, started_at, finished_at, rolled_back_at, applied_steps_count
FROM _prisma_migrations
WHERE migration_name = '20260212000000_add_password_reset'
ORDER BY started_at DESC;
