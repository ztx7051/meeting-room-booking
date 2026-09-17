SELECT
    r.name,
    COUNT(b.id) AS booking_count
FROM
    rooms r
    LEFT JOIN bookings b ON b.room_id = r.id
GROUP BY
    r.id, r.name

-- GROUP BY标准：SELECT 里裸着的列，必须全部出现在 GROUP BY 里（或能被分组键唯一确定）。b.room_id 只出现在 ON 里、没被 SELECT——它既不是聚合列也不是非聚合列，规则管不着它。
