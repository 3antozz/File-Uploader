WITH RECURSIVE fh AS (
                SELECT id, name, "parentId" FROM "Folder" WHERE id=$1
                UNION ALL
                SELECT f.id, f.name, f."parentId" FROM "Folder" AS f JOIN fh ON fh."parentId" = f.id)
                SELECT id, name FROM fh WHERE id >= $2 ORDER BY "parentId" NULLS FIRST;