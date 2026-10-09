# 🍽️ CravSave

### **Cravings. Savings.**

> **Discover great food at better prices — before it goes unsold.**

🔗 **Live Demo:** [cravsave.ai.studio](https://cravsave.ai.studio/?utm_source=chatgpt.com)

---

## 🌱 About CravSave

**CravSave** is a food-clearance marketplace connecting local bakeries, cafes, and restaurants with customers looking for quality food at better prices.

Businesses often have perfectly good food that needs to be sold sooner because it is approaching its best-before window, has not sold as quickly as expected, or looks different from the usual presentation.

Instead of letting that food go unsold, CravSave gives businesses a simple way to list it and gives customers an opportunity to discover great deals.

### The idea is simple:

**Businesses recover value.  
Customers save money.  
Good food gets another chance.**

---

## 💡 Why CravSave?

Food doesn't always go unsold because it's bad.

Sometimes:

- 🕐 It needs to be **used by today**
- 📉 It's **selling slowly**
- ✨ It **looks different**, but has the same quality and taste

CravSave makes these reasons transparent so customers know exactly **why a deal is cheaper**.

---

## 🏷️ Three Types of Deals

### 🕐 Use by Today

Food that is best consumed today or is approaching its best-before window.

> **Best enjoyed today.**

### 📉 Selling Slowly

Fresh, normal-quality food that hasn't sold as quickly as expected.

> **Made fresh today. Fewer customers picked it up than expected.**

### ✨ Looks Different

Food with an unusual shape or appearance but the same recipe, quality, and taste.

> **Unusual shape. Same quality and taste.**

---

## 🛍️ How It Works

### For Customers

```text
Discover a deal
      ↓
Understand why it's cheaper
      ↓
Choose quantity
      ↓
Reserve
      ↓
Pick up from the business
```

CravSave is **pickup-first**.

There is no delivery in the current version.

### For Businesses

```text
Create a deal
      ↓
Set price & quantity
      ↓
Choose why it's discounted
      ↓
Publish
      ↓
Receive reservations
      ↓
Hand over the order
```

---

## ✨ Core Features

- 🔎 Discover food deals
- 🏷️ Three transparent clearance categories
- 💰 Discounted prices and clear savings
- 🛍️ Deal reservations and order management
- 🏪 Business Mode and Customer Mode
- 🔔 Real-time deal alerts and notifications
- ⚙️ Automated price-drop and deal-expiry management
- 🧪 Live automation testing sandbox
- 📦 Inventory availability management
- 📱 Pickup-first marketplace experience

---

## ⚙️ Smart Automations

CravSave includes automated workflows designed to help businesses manage time-sensitive food deals without constantly monitoring every listing manually.

These automations keep deal availability and pricing up to date, notify customers when relevant changes occur, and help prevent reservations for expired deals.

### 🔥 1. New Deal Automation

**Trigger:** A business publishes a new deal.

**How it works:**

1. The business creates a deal and clicks **Publish Deal**.
2. The listing is saved to the Supabase database.
3. A database-triggered workflow generates a notification for customers.
4. The new deal becomes visible in the customer feed.
5. A notification toast appears at the top of the screen.
6. The Alerts bell badge updates to indicate the new alert.

**Example notification:**

> 🔥 New deal just dropped: Warm Pistachio Brioche — ₹70

**Why it matters:** Customers can discover newly published clearance deals quickly, helping businesses reach potential buyers while the food is still available.

### 📉 2. Scheduled Price Drop Automation

**Trigger:** A business schedules a price drop for an active deal.

**How it works:**

1. The business selects a deal in **My Deals**.
2. The business chooses the target price and scheduled execution time.
3. A Supabase scheduled worker checks for price drops that are due.
4. When the scheduled time arrives, the system updates the listing price.
5. The customer-facing deal card displays the new price.
6. A green **✓ Price Dropped** badge appears.
7. An alert is generated for customers who have notifications enabled.

**Example:**

| Detail | Before | After |
|---|---:|---:|
| Deal | Chocolate Croissant | Chocolate Croissant |
| Price | ₹60 | ₹50 |
| Customer savings | — | ₹10 |

**Why it matters:** Businesses can schedule a deliberate price adjustment to help sell remaining inventory before the pickup window closes.

**Important pricing principle:** The business controls the price-drop decision and target price. CravSave does not repeatedly reduce prices on its own or continue discounting beyond the schedule authorized by the business.

### ⏰ 3. Deal Expiry Automation

**Trigger:** An active deal reaches its configured selling cutoff.

**How it works:**

1. The business publishes a deal with a `sell_until` cutoff.
2. A Supabase scheduled worker checks active listings against their cutoff times.
3. When a deal reaches its cutoff, its status changes from `ACTIVE` to `EXPIRED`.
4. The deal card becomes visually dimmed and displays a **This Deal Has Ended** overlay.
5. The deal is no longer available for new reservations.
6. Checkout must reject the expired deal, even if the scheduled worker has not yet updated its visible status.

**Why it matters:** Expiry automation keeps the marketplace accurate, prevents customers from reserving unavailable deals, and reduces the need for businesses to close every listing manually.

---

## 🧪 Live Automation Testing Sandbox

CravSave includes a testing interface that lets you observe the intended automation behavior without waiting for normal scheduled times.

### How to access it

1. Open the [CravSave Live Demo](https://cravsave.ai.studio/?utm_source=chatgpt.com).
2. Click **Business Mode** in the top navigation.
3. Open the **Automations** tab.
4. Run the individual test actions below.

### Available automation tests

#### 🔥 Test 1: Publish New Deal (DB Hook)

Click **Publish New Deal (DB Hook)**.

The test is designed to:

- Publish a Warm Pistachio Brioche priced at ₹70.
- Save the deal to the database.
- Make it appear in the customer feed.
- Trigger a notification toast.
- Update the Alerts bell badge.

#### 📉 Test 2: Start 10s Price Drop Countdown

Click **Start 10s Price Drop Countdown**.

The test is designed to:

- Start a 10-second countdown for Chocolate Croissant.
- Change its price from ₹60 to ₹50 when the countdown finishes.
- Display the updated price.
- Show the **✓ Price Dropped** badge.
- Trigger a price-drop alert.

#### ⏰ Test 3: Start 10s Deal Expiry Countdown

Click **Start 10s Deal Expiry Countdown**.

The test is designed to:

- Start a 10-second countdown for an active deal.
- Expire the deal when the countdown finishes.
- Display the **This Deal Has Ended** overlay.
- Disable new reservations for the expired listing.

### Additional controls in My Deals

Individual listings may also offer:

- **Drop Price in 10s**
- **Expire in 10s**
- **Instant Drop**
- **Instant Expire**

These controls make it easier to test both immediate and scheduled behavior.

> **Testing note:** The sandbox actions describe the intended test behavior. Actual database persistence, scheduled-worker execution, notification delivery, and checkout enforcement should be verified against the live application.

---

## 🔔 Customer Notifications

Notifications help customers discover deals and stay informed about changes to listings they may be interested in.

CravSave's automation workflows can generate alerts for:

- 🔥 Newly published deals
- 📉 Scheduled price drops
- ⏰ Deal expiry and availability changes

Customers who enable notifications can receive relevant deal alerts. Notification preferences should remain under the customer's control, and the system should avoid duplicate alerts when a scheduled job retries.

CravSave's deal notifications are **not dependent on continuous customer location tracking**. Notifications follow the configured notification preferences and marketplace rules.

---

## 🏪 Business Control and Automation

Automation is intended to reduce repetitive work, not take pricing control away from business owners.

Businesses retain control over:

- Deal price and quantity
- Clearance category
- Pickup window
- Whether a deal should receive a scheduled price drop
- The target price for that scheduled drop
- When a deal should stop accepting new reservations

CravSave automates the execution of configured changes, updates the customer-facing experience, and communicates relevant changes through notifications.

---

## 🎯 The Goal

CravSave combines a transparent food-clearance marketplace with practical automation to help businesses sell more of their remaining inventory before it goes unsold.

**Discover better deals. Save money. Waste less food.**

### CravSave — Cravings. Savings.
