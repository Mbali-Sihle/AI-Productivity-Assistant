export type TemplateCategory =
  | "Prices"
  | "Availability"
  | "Delivery"
  | "Booking"
  | "Complaints"
  | "Hair Colours";

export type ReplyTemplate = {
  id: string;
  category: TemplateCategory;
  title: string;
  description: string;
  body: string;
  custom?: boolean;
};

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  "Prices",
  "Availability",
  "Delivery",
  "Booking",
  "Complaints",
  "Hair Colours",
];

export const REPLY_TEMPLATES: ReplyTemplate[] = [
  {
    id: "price-service",
    category: "Prices",
    title: "Service price quote",
    description: "Give a clear price for a hair service, with what's included.",
    body: `Hi [CUSTOMER NAME] 👋

Thank you for reaching out to [BUSINESS NAME]!

[SERVICE NAME] is R[PRICE].
This includes: [WHAT IS INCLUDED].
Time needed: about [DURATION].
Hair/extensions [ARE / ARE NOT] included — extra hair is R[HAIR PRICE].

Would you like me to book you in? 😊`,
  },
  {
    id: "price-product",
    category: "Prices",
    title: "Product price list",
    description: "Send prices for wigs, bundles or hair care products.",
    body: `Hi [CUSTOMER NAME] 👋

Here are our current prices:

• [PRODUCT 1] — R[PRICE]
• [PRODUCT 2] — R[PRICE]
• [PRODUCT 3] — R[PRICE]

Prices exclude delivery. Payment: [PAYMENT METHODS].
Let me know which one you'd like and I'll reserve it for you.`,
  },
  {
    id: "price-deposit",
    category: "Prices",
    title: "Deposit & payment terms",
    description: "Explain deposit, balance and payment methods politely.",
    body: `Hi [CUSTOMER NAME],

To secure your [SERVICE NAME] appointment on [DATE] at [TIME], a deposit of R[DEPOSIT] is required.
The balance of R[BALANCE] is payable on the day.

Payment options: [PAYMENT METHODS]
Please send proof of payment here and I'll confirm your slot. Thank you! 🙏`,
  },
  {
    id: "avail-in-stock",
    category: "Availability",
    title: "Item in stock",
    description: "Confirm an item is available and move to the sale.",
    body: `Hi [CUSTOMER NAME] 👋

Yes — [PRODUCT NAME] is in stock ✅
Price: R[PRICE]
Available: [LENGTH / COLOUR / TEXTURE OPTIONS]

I can hold it for you until [HOLD DEADLINE]. Would you like collection or delivery?`,
  },
  {
    id: "avail-out-of-stock",
    category: "Availability",
    title: "Out of stock (with alternative)",
    description: "Say no kindly and offer another option.",
    body: `Hi [CUSTOMER NAME],

Thank you for your interest! Unfortunately [PRODUCT NAME] is sold out at the moment 😔

Restock expected: [RESTOCK DATE]
In the meantime I have [ALTERNATIVE PRODUCT] at R[PRICE], which is very similar.

Would you like me to add you to the waiting list?`,
  },
  {
    id: "avail-slots",
    category: "Availability",
    title: "Open appointment slots",
    description: "Share the times you still have available.",
    body: `Hi [CUSTOMER NAME] 👋

These slots are still open this week:

• [DAY] — [TIME]
• [DAY] — [TIME]
• [DAY] — [TIME]

[SERVICE NAME] takes about [DURATION]. Which time suits you best?`,
  },
  {
    id: "delivery-options",
    category: "Delivery",
    title: "Delivery options & cost",
    description: "Explain courier, timing and cost.",
    body: `Hi [CUSTOMER NAME] 👋

Delivery options:
• [COURIER NAME] — R[FEE], [X] working days
• Collection at [AREA] — free

Orders placed before [CUT-OFF TIME] are sent the [SAME/NEXT] working day.
Please send your full name, delivery address and contact number and I'll arrange it.`,
  },
  {
    id: "delivery-tracking",
    category: "Delivery",
    title: "Order shipped / tracking",
    description: "Let a customer know the parcel is on the way.",
    body: `Hi [CUSTOMER NAME] 🎉

Your order has been shipped!

Courier: [COURIER NAME]
Tracking number: [TRACKING NUMBER]
Expected delivery: [DATE]

Please keep your phone nearby for the driver. Enjoy your hair! 💕`,
  },
  {
    id: "delivery-delay",
    category: "Delivery",
    title: "Delivery delay apology",
    description: "Own the delay and give a new date.",
    body: `Hi [CUSTOMER NAME],

I'm so sorry — your parcel has been delayed by [REASON].
New expected delivery date: [NEW DATE]
Tracking number: [TRACKING NUMBER]

Thank you for your patience. I'm following up with the courier and will keep you updated. 🙏`,
  },
  {
    id: "booking-confirm",
    category: "Booking",
    title: "Booking confirmation",
    description: "Confirm the appointment with all the details.",
    body: `Hi [CUSTOMER NAME] ✅

Your appointment is confirmed:

Service: [SERVICE NAME]
Date: [DATE]
Time: [TIME]
Where: [ADDRESS / AREA]
Price: R[PRICE] (deposit R[DEPOSIT] received)

Please come with [PREPARATION INSTRUCTIONS, e.g. washed and blow-dried hair].
See you soon! 💇🏽‍♀️`,
  },
  {
    id: "booking-reminder",
    category: "Booking",
    title: "Appointment reminder",
    description: "Friendly day-before reminder.",
    body: `Hi [CUSTOMER NAME] 👋

Just a reminder about your [SERVICE NAME] appointment tomorrow, [DATE] at [TIME], at [ADDRESS / AREA].

Please arrive [X] minutes early and bring [WHAT TO BRING].
Reply "YES" to confirm or let me know if you need to reschedule.`,
  },
  {
    id: "booking-reschedule",
    category: "Booking",
    title: "Reschedule / late cancellation",
    description: "Handle a change of plans and restate your policy.",
    body: `Hi [CUSTOMER NAME],

Thank you for letting me know. I can move your [SERVICE NAME] to:

• [DATE] at [TIME]
• [DATE] at [TIME]

Please note our policy: cancellations within [NOTICE PERIOD] mean the deposit [IS / IS NOT] transferable.
Which new time works for you?`,
  },
  {
    id: "complaint-general",
    category: "Complaints",
    title: "General complaint response",
    description: "Acknowledge, apologise and ask for the details.",
    body: `Hi [CUSTOMER NAME],

I'm really sorry to hear about [ISSUE] — that's not the standard I want for my clients.

Could you please send me a photo and let me know when this started? That helps me sort it out properly.

I'd like to make it right by [PROPOSED SOLUTION]. Thank you for giving me the chance to fix it. 🙏`,
  },
  {
    id: "complaint-service",
    category: "Complaints",
    title: "Install/style didn't last",
    description: "Offer a fix-up while protecting your policy.",
    body: `Hi [CUSTOMER NAME],

I'm sorry your [SERVICE NAME] didn't last as expected. 😔

Our fix-up policy covers [WHAT IS COVERED] within [NUMBER] days of the appointment.
I can book you in for a touch-up on [DATE] at [TIME] at [NO CHARGE / R[PRICE]].

Please also avoid [AFTERCARE TIP] so it holds better next time.`,
  },
  {
    id: "complaint-refund",
    category: "Complaints",
    title: "Refund / return request",
    description: "Explain your return process clearly and calmly.",
    body: `Hi [CUSTOMER NAME],

Thank you for reaching out, and I'm sorry the [PRODUCT NAME] wasn't what you expected.

Our policy: [RETURN POLICY, e.g. unopened items within X days].
Next step: please send a photo of the item and your order number [ORDER NUMBER].

Once received I'll arrange [REFUND / EXCHANGE / STORE CREDIT] within [TIMEFRAME]. 🙏`,
  },
  {
    id: "colour-brown",
    category: "Hair Colours",
    title: "Rich brown colour consultation",
    description: "Reply for clients wanting chocolate, chestnut or warm brown tones.",
    body: `Hi [CUSTOMER NAME] 👋

Thanks for your interest in our brown colour services at [BUSINESS NAME]!

We can create anything from a soft chocolate brown to a warm chestnut or deep espresso tone. This service starts at R[PRICE] and includes the colour treatment, wash, condition and a glossy finish.

Please note: a strand test may be needed if your hair has been previously coloured. Do you have a specific shade in mind? Send me a picture and I'll guide you. 🤎`,
  },
  {
    id: "colour-black",
    category: "Hair Colours",
    title: "Jet black / natural black colour",
    description: "Reply for clients wanting sleek black or blue-black colour.",
    body: `Hi [CUSTOMER NAME] 👋

Yes, we do jet black and natural black colour treatments! This service starts at R[PRICE] and is perfect if you want a rich, sleek look that lasts.

For the best result, we recommend coming with clean, product-free hair. The treatment takes about [DURATION].

Would you like to book a strand test or go straight to an appointment? 🖤`,
  },
  {
    id: "colour-gold",
    category: "Hair Colours",
    title: "Gold / honey blonde highlights",
    description: "Reply for clients wanting warm gold, honey or caramel tones.",
    body: `Hi [CUSTOMER NAME] ✨

Gold and honey tones are so beautiful! We can do balayage, foil highlights, or a full colour transformation starting from R[PRICE].

Because lightening hair is a process, the final look depends on your current hair colour and condition. If your hair has been relaxed or coloured before, please let me know so we can plan safely.

Would you like to book a consultation first? 💛`,
  },
  {
    id: "colour-maintenance",
    category: "Hair Colours",
    title: "Colour touch-up / maintenance",
    description: "Reply for root touch-ups or refreshing existing colour.",
    body: `Hi [CUSTOMER NAME] 👋

A colour refresh or root touch-up is a great way to keep your colour looking fresh. This starts at R[PRICE] and takes about [DURATION].

For best results, please book your touch-up every [WEEKS] weeks before your roots grow too far out. Would you like me to lock in your next slot? 💇🏽‍♀️`,
  },
  {
    id: "colour-correction",
    category: "Hair Colours",
    title: "Colour correction",
    description: "Reply for clients needing to fix a previous colour result.",
    body: `Hi [CUSTOMER NAME],

Thank you for trusting me with your colour correction — I know it can feel stressful when the colour isn't what you wanted. 😔

Colour correction is priced from R[PRICE] depending on how many sessions are needed. I'll need to see your hair in person or send me clear photos in natural light so I can assess it properly.

Please avoid box dye or any at-home treatments until we meet. When works for you? 🙏`,
  },
];
