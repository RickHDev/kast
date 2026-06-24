/* ============================================================
   Kastbouwer API - Cloudflare Pages Function op Cloudflare D1
   Routes (binding: env.DB):
     GET    /api/designs           -> [{id,name}]
     GET    /api/designs/:id        -> {id,name,data}
     POST   /api/designs            -> {id,name}     body: {name,data}
     PUT    /api/designs/:id        -> {id,name}     body: {name,data}
     DELETE /api/designs/:id        -> 204
     GET    /api/templates          -> [{id,name,data}]
     POST   /api/templates          -> {id,name}     body: {name,data}
     DELETE /api/templates/:id      -> 204
   ============================================================ */

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

export async function onRequest(context) {
  const { request, env, params } = context;
  const db = env.DB;
  if (!db) return json({ error: "D1-binding 'DB' ontbreekt" }, 500);

  const path = Array.isArray(params.path) ? params.path : params.path ? [params.path] : [];
  const [resource, id] = path;
  const method = request.method;

  try {
    /* ---- ontwerpen ---- */
    if (resource === "designs") {
      if (method === "GET" && !id) {
        const { results } = await db
          .prepare("SELECT id, name FROM kast_ontwerpen ORDER BY updated_at DESC")
          .all();
        return json(results || []);
      }
      if (method === "GET" && id) {
        const row = await db
          .prepare("SELECT id, name, data FROM kast_ontwerpen WHERE id = ?")
          .bind(id)
          .first();
        if (!row) return json({ error: "niet gevonden" }, 404);
        row.data = JSON.parse(row.data);
        return json(row);
      }
      if (method === "POST") {
        const body = await request.json();
        const newId = crypto.randomUUID();
        await db
          .prepare("INSERT INTO kast_ontwerpen (id, name, data) VALUES (?, ?, ?)")
          .bind(newId, body.name || "Mijn kast", JSON.stringify(body.data))
          .run();
        return json({ id: newId, name: body.name || "Mijn kast" }, 201);
      }
      if (method === "PUT" && id) {
        const body = await request.json();
        const res = await db
          .prepare("UPDATE kast_ontwerpen SET name = ?, data = ?, updated_at = datetime('now') WHERE id = ?")
          .bind(body.name || "Mijn kast", JSON.stringify(body.data), id)
          .run();
        if (!res.meta.changes) return json({ error: "niet gevonden" }, 404);
        return json({ id, name: body.name || "Mijn kast" });
      }
      if (method === "DELETE" && id) {
        await db.prepare("DELETE FROM kast_ontwerpen WHERE id = ?").bind(id).run();
        return new Response(null, { status: 204 });
      }
    }

    /* ---- sjablonen ---- */
    if (resource === "templates") {
      if (method === "GET" && !id) {
        const { results } = await db
          .prepare("SELECT id, name, data FROM kast_sjablonen ORDER BY created_at DESC")
          .all();
        (results || []).forEach((r) => (r.data = JSON.parse(r.data)));
        return json(results || []);
      }
      if (method === "POST") {
        const body = await request.json();
        const newId = crypto.randomUUID();
        await db
          .prepare("INSERT INTO kast_sjablonen (id, name, data) VALUES (?, ?, ?)")
          .bind(newId, body.name, JSON.stringify(body.data))
          .run();
        return json({ id: newId, name: body.name }, 201);
      }
      if (method === "DELETE" && id) {
        await db.prepare("DELETE FROM kast_sjablonen WHERE id = ?").bind(id).run();
        return new Response(null, { status: 204 });
      }
    }

    return json({ error: "onbekende route" }, 404);
  } catch (e) {
    return json({ error: String(e && e.message ? e.message : e) }, 500);
  }
}
