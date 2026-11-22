---
slug: ho-chi-minh-travel-with-crewx-agents
title: "Traveling Ho Chi Minh City with CrewX AI Agents (feat. CrewX App)"
authors: [doha]
tags: [crewx, crewx-app, ai-agent, travel, vietnam, automation]
image: "/img/blog/ho-chi-minh-travel-with-crewx-agents/01-travel-planner-schedule-en.webp"
description: "How I used AI agents and CrewX Apps on a Ho Chi Minh City trip: a travel planner, a receipt-screenshot expense splitter in a spreadsheet, and a Zalo translation Chrome extension for chatting in Vietnamese."
keywords: [Ho Chi Minh City travel, Vietnam trip, AI agent, AI travel planner, travel expense splitting, Zalo translation, Vietnamese translation, Chrome extension, CrewX, CrewX App, mini app]
---
# Traveling Ho Chi Minh City with CrewX AI Agents (feat. CrewX App)

I recently took a longer trip to Ho Chi Minh City, Vietnam. The first 6 nights and 7 days were a trip with a friend, and after my friend flew back home, I spent the remaining ten days based in Thảo Điền on a solo digital nomad schedule—roughly 30% work and 70% travel.

<!--truncate-->

In the past, I would have jotted down plans in Notion, dumped receipt photos into a solo chatroom, and copy-pasted back and forth in Google Translate. This time was different. I decided to put **CrewX** and **CrewX App**, which I am building, to the test in real travel situations from start to finish.

To briefly explain, **CrewX** is a workspace on my computer for working alongside AI agents, and its core feature, **CrewX App**, is a **mini-app you spin up on the spot—like instant food—so you and your agent can work while looking at the same screen**. Instead of just trading long chat messages with an AI, you say "Make me a travel planner view," "Open a spreadsheet for expense splitting," or "Build an interpreter card app for my date," and the screen is built right there for both you and the agent to operate together.

To start with the takeaway: the **Travel Planner App**, the **receipt-screenshot Spreadsheet expense splitter App**, and the **Zalo real-time translation Chrome extension** I whipped up to set up a date with a local woman were far more convenient than I expected. The one surprise was the **"Date Vietnamese" app** I built the night before the date. Once the two of us actually sat across from each other, I barely had any reason to use it.

---

## 1. Travel Planner App: Adjusting Routes and Schedules with a Single Sentence

On any trip, plans change on the ground more often than they go according to schedule. In particular, the rhythm of traveling with a friend for a week was completely different from working and resting solo for ten days.

CrewX's **Travel Planner** app puts a daily timeline, map, accommodation and restaurant notes, budget, and packing checklist on a single screen.

![1.00](/img/blog/ho-chi-minh-travel-with-crewx-agents/01-travel-planner-schedule-en.webp)

*Ten-day schedule based in Thảo Điền. The War Remnants Museum, which I missed on a weekday, is merged into Saturday's 'District 1 Walk' route.*

*Image text translated by AI.*

- **Before departure and on the move:** I had the agent research check-in and luggage storage rules confirmed with our Airbnb host, restaurant locations and hours, and estimated GrabBike distance, duration, and fare for each leg (based on the base fare for the first 2 km plus the per-km rate), and saved them as notes on each schedule card.
- **When plans changed on the spot:** When we ended up eating bánh mì instead of going to the phở shop (Phở Nam Chính) we had planned for breakfast, or when I visited a coworking space (The Hive) at lunchtime only to find no receptionist and switched to recording a demo video in my quiet accommodation, I simply told the chat what changed and the agent automatically rearranged that slot and the rest of the timetable. Merging the War Remnants Museum visit I missed on a weekday into Saturday's District 1 walking route took just one sentence as well.
- **Checking on the street:** Instead of scrolling up through a long chat history, opening the app automatically scrolled to the current or next item on today's schedule, so I could check the Grab search term and notes right away while moving.

---

## 2. Spreadsheet Expense Splitting: Settling a 6-Night, 7-Day Trip by Dropping 14 Payment Screenshots

After spending 6 nights and 7 days with my friend and seeing them off at the airport, the most tedious chore remained: **splitting our travel expenses**.

Settling accounts after an overseas trip is tricky because payment methods and currencies are all mixed together.

- Flights and two Airbnbs prepaid in Korean won (KRW) before departure
- Grab taxis and bikes hailed throughout the trip
- Meals, massages, and snacks recorded across Moca wallet payment history and the TrabeePocket expense tracker app
- In-flight beers my friend paid for first, plus an advance settlement payment they handed me on their way home

Instead of typing all of this into Excel by hand, I attached **14 screenshots in total—3 Grab activity screenshots, 2 Moca payment history screenshots, and 9 TrabeePocket screenshots**—straight to the agent.

The agent read the text inside the images, created a 52-row travel expense Excel (`xlsx`) file, and opened it directly in the **Spreadsheet app**.

![1.00](/img/blog/ho-chi-minh-travel-with-crewx-agents/02-spreadsheet-records-en.webp)

*From flight bookings to late-night Grab rides, records scattered across multiple apps were lined up chronologically in a single table.*

*Image text translated by AI.*

1. **Automatic categorization and route cleanup:** Reading the Vietnamese pickup and drop-off points in the Grab screenshots, the agent organized them into clean Korean place labels like `Grab: Airport (T2 Arrival) → 1st Airbnb` and `Grab: Airbnb → Restaurant`, sorted in chronological order. By cross-checking the screenshots, it even caught a ride that showed up as November 15 in the Grab wallet history but was actually boarded at 23:59 on the night of the 14th, and corrected the date.
2. **Settlement formulas included:** The agent converted payments made in Vietnamese đồng (VND) into Korean won, factored in the expenses my friend had paid upfront and the cash they had already handed over, and calculated the remaining balance.
3. **Asking me about ambiguous items:** While cross-checking the 14 screenshots against the 52 rows on the sheet, the agent flagged one payment at the airport. Looking at the receipt alone, there was no way to tell whether we had spent it together or if I had spent it alone after seeing my friend off.

Without digging through receipts again, I checked that single row in the table and finished the settlement.

---

## 3. Zalo Chrome Extension: Breaking the Messenger Language Barrier in Real Time (Even for a Local Date)

Honestly, when a guy stays abroad alone for more than two weeks, it is natural to want to go on a nice date with someone local. Even when you meet someone you like, though, the very first wall you hit in reality is the **language barrier**.

After my friend left and I stayed behind alone in Thảo Điền, I ended up setting up a dinner date with a local woman. In Vietnam, people use **Zalo** instead of KakaoTalk or WhatsApp. English alone was not enough to convey subtle interest, jokes, or warm nuances, and since I knew zero Vietnamese, I started out keeping a translator window open and copy-pasting back and forth.

In messenger conversations where you are flirting or setting up a date, **timing and back-and-forth tempo** are everything. Switching to a translator window for every single message, copy-pasting, and reverse-translating to check whether the translator captured what I actually meant kept breaking the rhythm of the conversation.

Thinking, *"Why not attach a CrewX translation agent running on my computer straight onto Zalo Web (`chat.zalo.me`)?"* I had my CrewX agent whip up a **CrewX Zalo translation Chrome extension** on the spot and hooked it up.

How it works is simple, but the difference in practice was huge.

- **Real-time automatic translation of incoming bubbles:** When I open a Zalo chatroom, Korean translations appear automatically right beneath each Vietnamese message bubble from the other person.
- **0.7-second input preview and reverse-translation check:** When I type a sentence in Korean in the input box and pause for just 0.7 seconds, the CrewX translation agent reads the surrounding context and pops up a preview above the input box showing a natural Vietnamese sentence to send, along with **a reverse-translation back into Korean** so I can verify the exact nuance. That prevents misunderstandings caused by stiff machine-translated phrasing before I even hit send.
- **Send with a single Enter + preserve my original text:** If the meaning looks right, pressing Enter sends the Vietnamese message immediately, and my original Korean sentence is displayed right below my Vietnamese bubble on screen.
- **Context-aware translation across the conversation:** Feeding sentences into a translator one by one often produces awkward literal translations, so this extension passes the preceding dialogue to the agent as well, keeping the flow natural from message to message.

![1.00](/img/blog/ho-chi-minh-travel-with-crewx-agents/04-zalo-translator-en.webp)

*Each message bubble gets a Korean translation underneath, and sentences typed in Korean are previewed with the 'Vietnamese sentence to send' and a 'meaning check' first. To respect privacy, this screenshot was recreated using sample dialogue on a mock Zalo screen built for extension development.*

*Image text translated by AI.*

Thanks to this extension, instead of fumbling with the language barrier, I could trade jokes naturally as if I were chatting in Korean, lock in a reservation time at a cozy pasta and steak restaurant in Thảo Điền, and even add thoughtful touches like *"I'll call a Grab for you when you head out."* (As a bonus, it worked wonderfully when messaging a local motorbike rental shop about 50cc scooter availability, deposits, and early-return refunds.)

---

## 4. The Day I Built 'Date Vietnamese'

With the Zalo Chrome extension, setting up the date went smoothly—but as the day of the date approached, a new worry crept in. *"The translation extension handles messenger chat, sure, but how are we going to talk sitting across from each other at the restaurant?"*

I looked for an app where I could type my current situation in Korean to get natural Vietnamese phrases with audio playback, but existing apps either did not support Vietnamese or only offered a handful of canned tourist phrases.

*"If it doesn't exist, I'll build it myself before tomorrow's date!"* Driven by that stubbornness, I used **CrewX App** to spin up an instant mini-app called **'Date Vietnamese'** in a single day. By describing the screens and features I wanted to the agent, I could build and run it right on my computer.

- **Built-in Southern (Ho Chi Minh City) accent audio:** I pre-generated audio clips for questions and expressions using four male and female voices with a local Ho Chi Minh City accent.
- **A 'Partner View' screen to show across the table:** After picking a question, playing the audio, and turning the enlarged screen toward her, she could tap one of four large Vietnamese choice buttons (1–4) or type her own reply.
- **Date coaching agent:** Once she picked an answer, this agent read the conversation flow so far in the background, summarized the mood in one line, and immediately selected the next question card to ask along with a Vietnamese reply for me to say back. Because I threw it together the night before, I went in with it barely working.

![1.00](/img/blog/ho-chi-minh-travel-with-crewx-agents/05-date-phrases-app-en.webp)

*From left to right: the intro screen shown to my date first ("I don't speak Vietnamese yet, so I'll ask you with this app"), a multiple-choice question card (1–4), and the 'Memorized Phrases' screen for choosing a Southern-accent voice.*

*Image text translated by AI.*

When the evening actually came, I barely used the app I had built. She was more comfortable with the translator app she normally used, and I had memorized a few short phrases of my own beforehand. For short expressions like *"Vui quá"* ("This is fun"), saying them directly in my own voice felt much better.

While building the app, I imagined our conversation would keep flowing if I showed her the screen and asked her to tap an answer. Once we were actually sitting face to face, though, I found I much preferred smiling quietly and making eye contact with her. Maybe that was even truer because it was a date. In that moment, there was no need to go looking for the next question.

---

## Wrapping Up — CrewX App, a Tool Shared by Humans and AI

When planning a trip with a friend over chat, talking about where you want to go is easy. The hard part is opening the chatroom a few days later and answering, "So where are we starting today?"—because you have to dig through every plan that changed along the way. That is why we move schedules onto a calendar and record shared expenses in a table. **Working with AI is the same.** To see changing schedules and expenses at a glance, humans and AI need a shared tool they can look at and edit together.

In Ho Chi Minh City, when I asked to move the War Remnants Museum I had missed on a weekday to Saturday, the agent added the museum to Saturday's District 1 walking route in the Travel Planner app. Out on the street, all I had to do was open that day's schedule. When splitting expenses, the moment sprang back to mind as soon as the agent pointed to a single airport payment row in the table. The agent found the payment timestamp; I knew whether my friend had been with me at the time.

You might think, "Sure, a developer can whip those up." Having written code for over 15 years probably helped me move a little faster. Yet having tried it, what mattered more than programming knowledge was a simple knack: sketch a screen mockup in the HTML Viewer app first, have the agent build the app from that mockup, and refine it as you actually use it. Once you get used to that loop, I felt even people who have never coded could build their own tools—and before long, plenty of people will be building them better than I do.

I want anyone to be able to build a tool like this tailored to their situation the moment they need it, and hand it over saying, "I made this little app—try it out." Then the next friend heading out on a trip can open that same planner with their own AI and put together their itinerary. **Enabling humans and AI to use the same tool, each contributing what they know to work together—that is where CrewX App is headed.** [Explore CrewX](https://crewx.dev)

*This post was written together with the `cmo` agent using CrewX's 'Blog Editor' mini-app.*
