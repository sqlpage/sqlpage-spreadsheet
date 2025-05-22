select 'json' as component;

REPLACE INTO todos (id, title)
SELECT cell.value->>'id', cell.value->>'value'
FROM json_each(:all_cells) AS cell
RETURNING
  id,
  title as value,
  case title when '' then 'red' else 'green' end as color;