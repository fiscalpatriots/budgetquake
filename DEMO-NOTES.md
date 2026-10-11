# Budgetquake demo notes

11 October 2026, 4:38 PM (clock read). Built on his word of about 3:30 PM on Sunday 11 October: a playable first month before the Tools Competition abstract is due (Tuesday 13 October, 11:59 PM Eastern), with a named household chosen from three, a Chromebook and phone and offline access line, and Spanish text.

**Live.** Published 11 October 2026 at 4:49 PM at https://fiscalpatriots.github.io/budgetquake/ from the public repository fiscalpatriots/budgetquake (main). Details are under Published at the end.

## Screens

| Screen | What it does | Screenshot (320 wide) |
|---|---|---|
| Choose a household | Three named households as full-width rows of one height, each with a first name, a job, monthly take-home pay and one line of situation. Start the month. | `320-en-jordan-01-start.png`, `-02-start-picked.png` |
| Seven cards | Payday, rent, phone bill, electric and internet bill, food, one wanted item, one surprise cost. Each card has three or four full-width choices with the amount on the right. After a choice, a reason box opens with a card-specific prompt and "One sentence is enough." Continue asks for at least three words and says "A few more words, please. Say what you weighed." if it gets fewer. Enter also submits. | `-04-card1.png` to `-10-card7.png`, `-03-card1-too-short.png` |
| Progress line | "Step 3 of 7" with checking and savings beside it, over a thin line that fills. The last choice's result sits quietly at the top of the next card. | every card |
| End of month 1 | Checking, savings and anything still owed; "Paid late or put off"; "Your reasons", every choice with the student's own sentence; "Every dollar this month" behind a disclosure, a ledger that adds to the closing balance. | `-11-month-end.png`, `-12-month-end-ledger.png` |
| Teacher view | A toggle in the header, no login. The household and month, "Three to discuss" (ranked, each with the choice, the student's reason and a question to ask), then every decision with its reason. Works mid-month as "To discuss so far". | `-13-teacher.png`, `-06b-teacher-midway.png`, `-00-teacher-empty.png` |
| On every screen | "Prototype: one month of six" under the name; the Español or English button; footer lines saying nothing typed is stored or sent, that it runs on a school Chromebook or a phone with no internet once open, and that the Spanish text is a prototype of the planned language support. | all |

All screenshots are in `screenshots/2026-10-11/`: 39 screens at each of 320, 375, 768, 1,024, 1,280 and 1,600 pixels, 234 in all, with `_checks.json` beside them. The folder is kept out of the repository by `.gitignore` so it is not published.

## The three households

Figures are whole dollars, illustrative for Northern Virginia in 2026. They were set by judgment against typical rents and wages for these jobs and places, not read from a published table on this date [CONFIRM against the federal fair market rents for the Washington metropolitan area and wage data before any document calls them sourced]. Every figure on a card is computed from the same numbers the arithmetic uses.

| | Jordan | Elena | Marcus |
|---|---|---|---|
| Job | Medical assistant at a family health clinic | Electrician with a building contractor | Respiratory therapist at a hospital |
| Situation | Lives alone in a studio in Annandale, rides the bus | Raises her eight-year-old son in a two-bedroom in Woodbridge, drives to job sites | Shares a two-bedroom in Herndon with his retired mother, covers rent and bills |
| Take-home pay a month | $3,080 | $4,420 | $5,140 |
| Left from last month | $140 | $210 | $260 |
| Costs that come out on their own | Student loan $180, bus fare $90, laundry $40, toiletries $30: $340 | After-school program $420, car insurance $138, gas $170, school lunches $52: $780 | Car payment $365, car insurance $121, gas $140, his mother's prescriptions $85: $711 |
| To plan with | $2,880 | $3,850 | $4,689 |
| Move to savings | $0, $150 or $300 | $0, $200 or $400 | $0, $250 or $500 |
| Rent (share of pay) | $1,640 (53 percent) | $2,050 (46 percent) | $2,450 (48 percent) |
| Renter's insurance, late fee | $14 a month, $75 | $16 a month, $100 | $16 a month, $100 |
| Phone | $68, or $40 prepaid | $85, or $45 prepaid | $110 for two lines, or $70 for two prepaid |
| Electric and internet | $59 and $65 | $96 and $90 | $112 and $93 |
| Food | $320, $430 or $620 | $540, $690 or $940 | $610, $780 or $1,090 |
| Wanted item | Concert: $145 floor, $70 upper level, or skip | Son's birthday bike: $220 new, $85 used, $55 now and $165 owed in three payments, or wait | Friend's wedding in Richmond: $340 weekend, $150 day trip, or $75 gift |
| Surprise | Phone screen: $249 with a 90-day warranty, $159 at a kiosk, or keep it cracked | Brakes: $640 pads and rotors, $310 pads only, or put it off | Sprained ankle: $350 emergency room copay, $165 urgent care and X-ray, or ice and wait |
| Month-end, checking plus savings, over every path | $91 below zero to $821 (78 of 2,187 paths overdraw) | $451 below zero to $1,119 (412 of 2,916) | $6 below zero to $1,372 (48 of 2,187) |

Rules the arithmetic follows: a late payment costs the bill plus its fee in the same month and is listed under "Paid late or put off"; a surprise cost draws on savings first and checking for the rest; any payment that leaves checking below zero adds a $30 overdraft fee; the bike's three later payments show as still owed. The late fees run 4 to 5 percent of rent, under the 10 percent cap Virginia sets for residential leases [CONFIRM the statute at source].

**How the three to discuss are chosen.** Each choice carries a weight (a put-off safety or health repair weighs most, then a late rent payment, a late bill, an installment plan, a canceled internet plan in a household that relies on it). Context adds weight: a payment that overdrew checking, saving nothing on payday when the surprise then hit checking, the biggest savings move when an overdraft followed, a full-price want bought with nothing in savings, a canceled internet plan on top of a smaller phone plan, and a reason under five words. The top three show, ties broken by step order, each with a question the teacher can ask.

## Against the abstract

The brief named ABSTRACT-K12-rev7.md. The current text is ABSTRACT-K12-rev10.md (4:16 PM), which already says "A student picks one of three named households" and "The first month, with a teacher view, is playable at [DEMO-URL], and the rest is in design." The table follows rev10.

| Abstract says | In the demo |
|---|---|
| A student picks one of three named households and lives on its paycheck | Honored |
| Each month brings events, such as a car repair or cut hours | Car repair (Elena), phone screen (Jordan), medical copay (Marcus). Cut hours deferred to later months |
| The student picks a response and types a one-line reason | Honored, required on every card |
| A month-end review shows what the budget absorbed and missed | Honored: balances, paid late or put off, reasons replayed, every dollar |
| ...and the student revises it | Deferred. Revision belongs to the start of month two |
| Six simulated months, then an unfamiliar household with no feedback, and a similar one weeks later | Deferred. The label says one month of six |
| The first month, with a teacher view, is playable | Honored, live at https://fiscalpatriots.github.io/budgetquake/ |
| An event agent and a coach, each bounded, with checks | Deferred. The prototype has no model and makes no network request; events are fixed per household |
| Students never chat with a model | Honored (there is none) |
| Every decision is logged; the rubric scores each reason for fixed costs, variable costs, wants against needs and surprise costs | The cards map to those four (rent and bills, food, the wanted item, the surprise). Decisions live in memory for the session only; nothing is logged or scored |
| A class view shows each student's errors and suggests the next scenario | Partly: a one-student teacher view with three ranked decisions. Class view, class codes and the next-scenario suggestion deferred |
| Points and class standings for planning moves | Deferred. They belong with the randomized study design |
| One file for a school Chromebook or a phone, no student accounts | Honored: one file, no account. Checked at 320 to 1,600 wide in a browser engine, not yet on a real Chromebook or phone [CONFIRM on a device] |
| The first month already plays offline | Honored once the page is open, and from a saved copy opened as a file (zero network requests, nothing stored). A first visit to the web address needs a connection; an offline cache for repeat visits would need a second file and was left out to keep one file |
| Screens planned for keyboard and screen reader use | Native radio groups with a legend, a spoken status line, focus moved to each new card title, a visible focus ring, Enter to submit, every tap target 44 pixels or more |
| Scenarios at a sixth-grade reading level | The English card text estimates at grade 4.4 overall; the hardest card (Marcus's electric and internet bill) at about 7.4. A rough count, not a validated measure |
| Local prices from public tables such as federal fair market rents | Deferred. Figures are illustrative |
| A plain editor for adding a household | Deferred. Households are data inside the page |
| Free to schools and students | Released under the license in LICENSE |
| The first month has a Spanish toggle | Honored. Every visible line switches; typed reasons stay as typed. Word choices: cuenta corriente for checking, docente for teacher, carro and manejar as spoken in the region [CONFIRM by a native speaker before it is shown to teachers] |

The sponsor's drafting document says "links to external materials will NOT be considered" (FORM-FIELDS-verified-2026-10-06.md), so the abstract's demo sentence has to stand on its words. The link is there for anyone who looks.

## Checks run

- Every choice path for every household played in a headless browser, 7,290 months: the ledger adds to the closing balance every time, and no screen printed an undefined value.
- 234 screenshots. The 320, 375, 768 and 1,280 sets were looked at in full and the 1,024 and 1,600 sets in part (the column is the same 608 pixels from 768 up), across four rounds of fixes (balances stated twice on the month-end, a disclosure with no marker, a reason box that clipped a three-line Spanish reason, ledger rows named by card title, amounts repeated in the teacher view, a line break inside X-ray, two long card sentences). The page's own checks found no sideways overflow, no clipped text and no tap target under 44 pixels at any width. The harness runs with browser extensions off, because one injected a sidebar into the page.
- Contrast: every text pair is 5.06:1 or better (soft grey on white 7.20:1, red on white 7.20:1, white on ink 17.40:1); choice borders 4.54:1 and the focus ring 7.10:1 against the page.
- No dashes, acronyms or employer names in the visible copy.

## Published

Published on his word ("publish") on Sunday 11 October 2026. The public repository fiscalpatriots/budgetquake was created at 4:48 PM through the GitHub API with the fiscalpatriots sign-in already stored on this computer, commit 8019656 was pushed to main, and Pages was set to deploy from main, / (root). The page answered at 4:49 PM (clock read).

Live address: https://fiscalpatriots.github.io/budgetquake/ (43 characters, inside the 73 the abstract field can take). The served index.html matched the local file byte for byte, and the start screen with Jordan, Elena and Marcus rendered at 1,280 and 375 wide with no sideways scroll.

To publish a later change: commit in this folder, then `git -C "C:\Users\Khaled\Documents\budgetquake" push`. Pages rebuilds from main within a minute or two.
