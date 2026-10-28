const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const ts = require("typescript");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "isil-tests-"));
for (const name of ["academic", "grade-presets"]) {
  const source = fs.readFileSync(
    path.join(__dirname, "..", "lib", `${name}.ts`),
    "utf8",
  );
  fs.writeFileSync(
    path.join(temp, `${name}.js`),
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    }).outputText,
  );
}
const {
  calendarWeeks,
  eventSegment,
  makeICS,
  googleCalendarURL,
  validPeriod,
  weighted,
  parseSaved,
} = require(path.join(temp, "academic.js"));
const { defaultRows } = require(path.join(temp, "grade-presets.js"));
after(() => fs.rmSync(temp, { recursive: true, force: true }));
const event = {
  id: "event-1",
  title: "Prueba, JPA; entrega\nFinal",
  start: "2026-10-30T08:00",
  end: "2026-11-03T23:59",
  originalStart: "2026-10-30T08:00",
  originalEnd: "2026-11-03T23:59",
  done: false,
};
const course = {
  id: "course-1",
  name: "Desarrollo de aplicaciones",
  code: "3703",
  color: "#7c3aed",
  mode: "actual",
  rows: defaultRows("actual"),
  events: [event],
};
test("weighted average preserves each course and defaults by mode", () => {
  const rows = defaultRows("actual").map((r, i) => ({
    ...r,
    grade: String([18, 17, 19, 18, 19][i]),
  }));
  assert.equal(weighted(rows), 18.4);
  assert.equal(weighted(course.rows), 0);
  assert.equal(defaultRows("english").length, 13);
  assert.notEqual(defaultRows("actual")[0].id, defaultRows("english")[0].id);
});
test("calendar starts on Monday, covers month and spans weeks and months", () => {
  const weeks = calendarWeeks(new Date(2026, 9, 1));
  assert.equal(weeks[0][0].getDay(), 1);
  assert.equal(weeks.flat().filter((d) => d.getMonth() === 9).length, 31);
  assert.deepEqual(eventSegment(event, weeks[weeks.length - 1]), {
    start: 5,
    span: 3,
  });
  const november = calendarWeeks(new Date(2026, 10, 1));
  assert.deepEqual(eventSegment(event, november[1]), { start: 1, span: 2 });
  const midnight = {
    ...event,
    start: "2026-10-30T08:00",
    end: "2026-10-31T00:00",
  };
  assert.deepEqual(eventSegment(midnight, weeks[weeks.length - 1]), {
    start: 5,
    span: 1,
  });
});
test("rejects reversed, empty and invalid periods", () => {
  assert.equal(validPeriod(event.start, event.end), true);
  for (const [start, end] of [
    [event.end, event.start],
    ["", ""],
    [event.start, event.start],
    ["bad", event.end],
  ])
    assert.equal(validPeriod(start, end), false);
});
test("ICS uses escaped summaries, CRLF, UTC instants, stable UID and UTF-8 folding", () => {
  const ics = makeICS(
    [{ course: { ...course, name: "á".repeat(100) }, event }],
    new Date("2026-10-24T00:00:00Z"),
  );
  assert.ok(ics.includes("UID:event-1@calculadora-notas-isil\r\n"));
  assert.ok(ics.includes("DTSTART:20261030T"));
  assert.ok(
    ics.replace(/\r\n /g, "").includes("Prueba\\, JPA\\; entrega\\nFinal"),
  );
  assert.ok(ics.endsWith("END:VCALENDAR\r\n"));
  for (const line of ics.split("\r\n"))
    assert.ok(Buffer.byteLength(line) <= 75);
  assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, 1);
  assert.equal(
    (
      makeICS([{ course, event: { ...event, end: "" } }]).match(
        /BEGIN:VEVENT/g,
      ) || []
    ).length,
    0,
  );
});
test("Google Calendar parameters retain full title and the event period", () => {
  const url = new URL(googleCalendarURL(course, event));
  assert.equal(url.hostname, "calendar.google.com");
  assert.ok(url.searchParams.get("text").includes(event.title));
  assert.match(url.searchParams.get("dates"), /^\d{8}T\d{6}Z\/\d{8}T\d{6}Z$/);
});
test("backup round-trip restores pages, courses, grades and dates; corrupt structures fail", () => {
  const pages = [{ id: "page-1", name: "Ciclo 2026-2", courses: [course] }];
  assert.deepEqual(parseSaved(JSON.stringify(pages)), pages);
  for (const raw of [
    "null",
    "[]",
    "{}",
    '[{"id":"p"}]',
    JSON.stringify([{ ...pages[0], courses: [{ ...course, color: "bad" }] }]),
    JSON.stringify([
      {
        ...pages[0],
        courses: [{ ...course, events: [{ ...event, end: "" }] }],
      },
    ]),
  ])
    assert.throws(() => parseSaved(raw));
});
