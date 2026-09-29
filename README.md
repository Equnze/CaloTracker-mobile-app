# CaloTracker mobile app

Calotrak is a colorful Android calorie tracker. You name the person the log is for, add foods with a calorie count, and see how many calories are left against a daily goal. The log stays on the phone. Nothing is sent to a server.

This app carries over the browser Calotrak log and adds a screen for opening older days.

## Features

- Record the name of the person the log is for.
- Add a food with a calorie count.
- Show calories left today against a daily goal. The goal starts at 2,000 and can be changed.
- Turn the total hot pink and say “over today” when the goal is passed.
- Remove an entry from a day’s log.
- Start a fresh log each new day. Older days stay saved on the phone.
- Open **Past days** to browse earlier logs and the foods in each day.

## Screens

| Screen | What it shows |
| --- | --- |
| Today | The person’s name, calories left, the daily goal, the add-food form, and today’s log |
| Past days | Every saved day, with calories eaten and how far that day is from the goal |
| Day | The foods logged on one date, with the option to remove an entry |

The daily goal is one number for the whole log. Past days are measured against the goal you have set now.

## How the data is stored

Foods, the person’s name, and the daily goal are saved on the device with AsyncStorage under the key `calotrak`. The saved shape is:

```json
{
  "goal": 2000,
  "person": "Ada",
  "entries": {
    "2026-09-29": [
      {
        "id": "example-id",
        "name": "Mango bowl",
        "calories": 420,
        "at": "2026-09-29T16:00:00.000Z"
      }
    ]
  }
}
```

Clearing the app’s storage, or uninstalling the app, removes the log. A browser copy of Calotrak keeps its own separate log.

## Requirements

- Node.js 20.19.4 or newer (or Node 22.13 / 24.3 / 25+)
- npm
- For a phone preview: [Android Studio](https://developer.android.com/studio) with a virtual device, or a physical Android phone with Expo Go

This project uses Expo SDK 57 and React Native.

## Run the app

From this folder:

```bash
npm install
```

Start the Expo dev server:

```bash
npm start
```

### In a browser

```bash
npm run web
```

Then open the URL Expo prints, usually `http://localhost:8081`. The browser preview is useful for layout and for trying the log. Storage in that preview stays in that browser.

### On an Android emulator

1. Install Android Studio.
2. Open **Device Manager** and create a phone image.
3. Start that virtual device.
4. From this folder, run:

```bash
npm run android
```

Expo installs and opens Calotrak on the emulator. The food log is stored on that virtual phone.

### On a physical Android phone

Install [Expo Go](https://expo.dev/go) from the Play Store, run `npm start` on your computer, and scan the QR code. The phone and the computer need to be on the same network.

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Starts the Expo dev server |
| `npm run android` | Opens the app on a connected Android emulator or device |
| `npm run web` | Opens the app in a browser |
| `npm run ios` | Opens the app on the iOS simulator (macOS only) |

## Project layout

```text
App.tsx                 App shell, fonts, and navigation
app.json                Expo name, icon, and Android settings
src/LogContext.tsx      In-memory log and saving
src/storage.ts          Load and save the on-device log
src/dates.ts            Day keys, labels, and calorie totals
src/theme.ts            Colors and fonts
src/screens/HomeScreen.tsx
src/screens/HistoryScreen.tsx
src/screens/DayScreen.tsx
```

## Design

The interface uses a dark plum background with gold, magenta, coral, mint, and cyan. The big calorie number uses Fraunces. Labels and buttons use Nunito. The app is locked to portrait.

## License

The Expo template license in `LICENSE` applies to the Expo scaffolding included in this project.
