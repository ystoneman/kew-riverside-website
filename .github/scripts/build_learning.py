"""Render the sourced educational context and aggregate attainment download."""
import csv
from html import escape
import io


def e(value):
    return escape(str(value), quote=True)


def pct(value):
    return 'Not available' if value is None else f'{value}%'


def table(caption, headers, rows):
    body = ''
    for row in rows:
        cells = f'<th scope="row">{e(row[0])}</th>' + ''.join(f'<td>{e(c)}</td>' for c in row[1:])
        body += '<tr>' + cells + '</tr>'
    return (f'<div class="data-table-scroll" role="region" aria-label="{e(caption)}; scroll horizontally if needed" tabindex="0"><table><caption>{e(caption)}</caption><thead><tr>'
            + ''.join(f'<th scope="col">{e(h)}</th>' for h in headers)
            + '</tr></thead><tbody>' + body + '</tbody></table></div>')


def render(data):
    records = data['records']
    years = ['2022/23', '2023/24', '2024/25']
    groups = ['Kew Riverside', 'Richmond upon Thames', 'England', 'Darell']
    combined = 'Reading, writing and maths'
    def result(group, year, subject=combined, source=None):
        return next(r for r in records if r['group'] == group and r['academicYear'] == year and r['subject'] == subject and (r['source'] == source if source else r['status'] == 'Final'))
    def values(r):
        return [pct(r['expectedPercent']), pct(r['higherPercent'])]
    charts = ''
    # Separate facets share a fixed 0–100 scale and direct value labels.
    for gi, group in enumerate(groups[:3]):
        chart_id = 'attainment-chart' if gi == 0 else f'attainment-chart-{gi}'
        name = 'Richmond' if gi == 1 else group
        desc = '; '.join(f"{year}: {result(group, year)['expectedPercent']}%" for year in years)
        charts += f'<svg id="{chart_id}" viewBox="0 0 180 208" role="img" aria-labelledby="{chart_id}-title {chart_id}-desc"><title id="{chart_id}-title">{e(name)}: combined expected-standard attainment, 2023–2025</title><desc id="{chart_id}-desc">{e(desc)}. Same zero to 100 percent scale in every chart.</desc><text class="attainment-name" x="90" y="23" text-anchor="middle">{e(name)}</text>'
        for yi, year in enumerate(years):
            value = result(group, year)['expectedPercent']
            x = 28 + yi * 46
            charts += f'<rect class="attainment-bar series-{gi}" x="{x}" y="{150-value}" width="28" height="{value}"/><text x="{x+14}" y="{143-value}" text-anchor="middle">{value}%</text><text x="{x+14}" y="172" text-anchor="middle">{year[-2:]}</text>'
        charts += '<line class="grid" x1="20" x2="157" y1="150" y2="150"/><text x="80" y="194" text-anchor="middle">2023 · 2024 · 2025</text></svg>'
    combined_rows = []
    for year in years:
        for group in groups:
            c = next((c for c in data['cohorts'] if c['group'] == group and c['academicYear'] == year), None)
            count = str(c['eligiblePupils']) if c and c['eligiblePupils'] is not None else 'Not verified' if c else 'Not shown'
            combined_rows.append([year, group] + values(result(group, year)) + [count])
    combined_table = table('Combined reading, writing and maths · final DfE results', ['Academic year', 'School or area', 'Expected standard', 'Higher standard', 'Eligible pupils'], combined_rows)
    subject_rows = [[subject, group] + values(result(group, '2024/25', subject)) for subject in ['Reading','Writing','Maths'] for group in groups]
    subject_table = table('Subject attainment · 2024/25 · final DfE results', ['Subject', 'School or area', 'Expected standard', 'Higher standard'], subject_rows)
    older_rows = [[year, subject, pct(result('Kew Riverside',year,subject,'inspection')['expectedPercent'])] for year in years[:2] for subject in ['Reading','Writing','Maths']]
    older_table = table('Kew earlier subject attainment · inspection report, PDF pages 9–10', ['Academic year','Subject','Expected standard'], older_rows)
    newer_rows = [[subject]+values(result('Darell','2025/26',subject,'darell-2026'))+values(result('England','2025/26',subject,'england-2026')) for subject in [combined,'Reading','Writing','Maths']]
    newer_table = table('Separate 2025/26 update · Darell school report and England provisional data', ['Subject','Darell expected','Darell higher','England expected','England higher'], newer_rows)
    return f'''
<section class="data-section" id="learning-and-results" aria-labelledby="learning-title"><p class="eyebrow">05 / Learning and results</p><h2 id="learning-title">What does the educational evidence show?</h2>
<p class="section-lead">Kew’s combined reading, writing and maths attainment exceeded the England figure in each published year from <strong>2023 to 2025</strong>. Its results fluctuated: <strong>75%, 67%, then 73%</strong>, against England’s <strong>60%, 61%, 62%</strong>. Richmond’s figures were <strong>74%, 76%, 78%</strong>; Kew was below the borough figure in 2024 and 2025.</p>
<p class="data-context">These are different, small Year 6 cohorts: 12 eligible pupils at Kew in 2023 and 15 in 2025; the 2024 eligible count has not been independently verified here. One pupil can change a small cohort’s percentage substantially. These figures describe attainment, not the same children’s progress, a school ranking or the cause of their results.</p>
<figure class="attainment-figure"><div class="attainment-charts">{charts}</div><figcaption>Percentage meeting the expected standard in all three subjects · academic years 2022/23–2024/25 · same 0–100% scale. <a href="#attainment-tables">Jump to results tables</a>.</figcaption></figure>
<p class="chart-footnote">Final DfE data: <a href="{e(data['sources'][0]['url'])}">school results</a>, <a href="{e(data['sources'][1]['url'])}">Richmond and England</a>, and <a href="{e(data['sources'][2]['url'])}">eligible cohorts</a>. Dataset version 1.0.1, published 23 April 2026; checked 22 September 2026. Expected standard is the combined measure; “higher” requires higher-standard reading/maths and greater-depth writing.</p>
<aside class="reading-note" id="newer-darell-results"><p><strong>A newer Darell result matters.</strong> The historical tables below include Darell. Its <a href="{e(data['sources'][4]['url'])}">2025/26 school announcement</a> reports a recovery to <strong>68% combined expected standard</strong> for its whole cohort of <strong>22 pupils</strong>, against a <strong>63% England benchmark</strong>. This includes pupils in specialist resource provision. It is school-reported, not matched here to final DfE school-level data; England’s figures are <a href="{e(data['sources'][5]['url'])}">provisional</a>. Comparable Kew 2026 results were not located. Do not compare Kew 2025 and Darell 2026 as the same year.</p></aside>
<details class="data-disclosure" id="attainment-tables"><summary>View results by year, school and subject</summary><p>All school comparisons use whole cohorts; no pupils in specialist resource provision are selectively excluded. Richmond and England are state-funded-school aggregates. These percentages cannot predict an individual child’s experience or establish the effect of a transfer.</p>{combined_table}<p>In 2025, Kew’s expected-standard reading and writing were above England’s, while maths was one percentage point below. All three were below Richmond’s. Reading and maths are test results; writing is teacher-assessed.</p>{subject_table}<p>The current DfE extract does not provide the earlier subject percentages here. The inspection supplies Kew’s earlier expected-standard figures separately; comparable older subject/higher-standard cells not verified in this collection remain unavailable.</p>{older_table}<p><a href="evidence.html#source-inspection-2026">Inspection report, PDF pages 9–10</a>. The 2025 Kew figures in the report agree with the DfE table above.</p>{newer_table}<p>“Not available” means a measure was not verified in this collection; it never means zero. These newer rows are separate from the final 2023–2025 series.</p></details>
<details class="data-disclosure" id="attainment-method"><summary>Sources, missing values and a conflicting school graphic</summary><p>Use the academic year to compare results, not the date a page was published. This collection uses final DfE school/area results and eligible-pupil metadata, with the inspection’s historical subject table and the newer Darell announcement clearly distinguished. It does not infer 2024 cohort counts from a three-year total.</p><p>Kew’s school-published 2025 graphic gives maths as 76% expected and 29% higher, while final DfE gives 73% and 33%. We use the final DfE values; the reason for the difference has not been established. The inspection describes Kew’s 2024 combined result as close to average, although its percentage is numerically above England’s. There are no 2024/25 KS1-to-KS2 progress measures because that cohort’s earlier assessments were cancelled.</p><p>Downloads retain missing values rather than converting them to zero. The selected years do not bridge cancelled assessment years. School comparisons cannot separate teaching effects from cohort composition or other influences.</p></details>
<p class="learning-downloads"><a class="text-link" href="attainment.csv" download="attainment.csv">Download attainment data (CSV) ↓</a> · <a href="attainment-data.json" download="attainment-data.json">Attainment data and sources (JSON)</a></p>
<div class="learning-context" id="inspection-summary"><h3>What the July 2026 inspection found</h3><p>The <a href="evidence.html#source-inspection-2026">full, 16-page Ofsted report hosted by the school</a> records an inspection on <strong>8 July 2026</strong>. Its category judgements should be read individually; this is not a single overall grade.</p><ul><li><strong>Strong standard:</strong> early years; inclusion; personal development and wellbeing.</li><li><strong>Expected standard:</strong> achievement; curriculum and teaching; leadership and governance.</li><li><strong>Needs attention:</strong> attendance and behaviour. Inspectors praised behaviour but identified persistent absence.</li><li><strong>Safeguarding: Standards met.</strong></li></ul><p>Next steps include improving attendance and making teaching approaches consistent. On page 6, inspectors also describe pupils supporting younger children’s reading and taking leadership responsibilities. Those are observed features, not proof that mixed-age grouping caused them. <a href="{e(data['sources'][3]['url'])}">Read the full inspection, including improvement areas ↗</a>.</p></div>
<div class="learning-context" id="mixed-age-curriculum"><h3>How mixed-age learning is planned at Kew</h3><p>The <a href="https://www.kewriverside.richmond.sch.uk/page/?pid=555&amp;title=The+Kew+Curriculum">school’s curriculum explanation</a> describes a two-year Cycle A/Cycle B plan, intended to cover the National Curriculum while building on prior learning. Its <a href="https://www.kewriverside.richmond.sch.uk/page/?pid=543&amp;title=Whole+Curriculum+Overview">current overview</a> identifies Cycle B for 2025/26 and Cycle A for 2026/27.</p><p>A concrete example: the <a href="https://www.kewriverside.richmond.sch.uk/attachments/download.asp?file=3618&amp;type=pdf#page=3">Year 1/2 curriculum map, PDF page 3</a> lists the Great Fire of London for Cycle A’s first autumn half-term, and the Gunpowder Plot/Remembrance Day for Cycle B. Alternating topics illustrates the school’s coverage plan; it does not independently establish that every child avoids missed or repeated learning.</p><p>The school’s pages give inconsistent class counts, so this site does not assert a current count. Ask the school how the cycle, subject progression and support work for your child. <a href="faq.html#mixed-age-research">What research does—and does not—tell us about mixed-age classes</a> · <a href="index.html#visit-school">Ask about a visit</a>.</p></div>
<aside class="reading-note"><p><strong>A useful consultation question:</strong> how have the options been assessed against Kew’s existing curriculum, opportunities for pupils to support younger children, and continuity of teaching and relationships—and what would each option preserve or change?</p><p><a href="proposal.html#questions">Read the other questions about the proposal</a> · <a href="feedback.html?kind=evidence#feedback-form">Share evidence or a correction</a>.</p></aside></section>
'''


def csv_text(data):
    stream = io.StringIO(newline='')
    writer = csv.writer(stream, lineterminator='\r\n')
    writer.writerow(['School or area','Academic year','Subject','Measure','Value','Unit','Cohort definition','Status','Source URL','Source location','Checked on'])
    sources = {s['id']:s for s in data['sources']}
    for r in data['records']:
        for key, measure in [('expectedPercent','Expected standard'),('higherPercent','Higher standard')]:
            writer.writerow([r['group'],r['academicYear'],r['subject'],measure,'Not available' if r[key] is None else r[key],'percent',r['cohort'],r['status'],sources[r['source']]['url'],r['locator'],data['checkedOn']])
    for c in data['cohorts']:
        writer.writerow([c['group'],c['academicYear'],'All subjects','Eligible pupils','Not verified' if c['eligiblePupils'] is None else c['eligiblePupils'],'pupils','All pupils; whole school cohort',c['status'],sources[c['source']]['url'],'Eligible pupils',data['checkedOn']])
    return '\ufeff'+stream.getvalue()
