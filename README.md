# GarageBook

A mobile app for tracking the status of your cars: maintenance, repairs, mileage and upcoming services.

Built with **React Native (Expo)**, **React Navigation** and **Firebase** (Authentication + Cloud Firestore).

> 📦 **Android APK:** _link will be added after the first EAS build_

---

## Tech Stack

| Area | Technology |
|---|---|
| Framework | Expo SDK 58, React Native 0.88, React 19 (JavaScript) |
| Navigation | React Navigation 7: Native Stack + Bottom Tabs |
| Backend | Firebase Authentication (email/password), Cloud Firestore |
| Session storage | Firebase Auth persistence backed by `expo-secure-store` |
| Native features | `expo-image-picker` (camera + gallery) |
| Inputs | `@react-native-community/datetimepicker`, `@react-native-community/slider`, `@react-native-picker/picker`, `Switch` |

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- The **Expo Go** app on an Android/iOS device, or an Android emulator
- A Firebase project

### 1. Install dependencies

```bash
git clone <repository-url>
cd React-Native-Project
npm install
```

### 2. Configure Firebase

1. In the [Firebase console](https://console.firebase.google.com/) create a project.
2. **Authentication** → Sign-in method → enable **Email/Password**.
3. **Firestore Database** → create a database, then set these security rules:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

4. Project settings → **Your apps** → add a **Web app** and copy its config.
5. Copy `.env.example` to `.env` and fill in the values:

   ```bash
   cp .env.example .env
   ```

### 3. Run the app

```bash
npx expo start
```

Scan the QR code with Expo Go, or press `a` to open an Android emulator.
After changing `.env`, restart with a cleared cache: `npx expo start -c`.

### 4. Build the APK

```bash
npx eas-cli@latest build -p android --profile preview
```

## Project Structure

```
src/
├── App.js                 # Providers (safe area, auth) + root navigator
├── components/            # Reusable UI components
├── config/firebase.js     # Firebase app, Auth (secure persistence), Firestore
├── contexts/AuthContext.js
├── navigation/            # RootNavigator, AuthStack, AppTabs, GarageStack
├── screens/
│   ├── auth/              # Login, Register
│   ├── garage/            # VehicleList, VehicleDetails, RecordDetails, VehicleForm, RecordForm
│   └── main/              # Upcoming, Profile
├── services/              # Firestore data access, secure storage adapter
└── theme/                 # Colors
```

---

# Functional Guide

## 1. Project Overview

**Application Name:**

GarageBook

**Application Category / Topic:**

Automotive / Productivity: vehicle maintenance tracking

**Main Purpose:**

GarageBook helps car owners keep a complete service history for each of their vehicles in one place. Users register their vehicles and log every maintenance job, repair and inspection with its date, mileage, cost and an optional photo of the receipt. When a record includes a reminder (next due date and/or mileage), the app works out each vehicle's status (**OK**, **Due soon** or **Overdue**) so the user always knows which car needs attention next.

## 2. User Access & Permissions

### Guest (Not Authenticated)

- **Available screens or actions:** Only the **Login** and **Register** screens. A guest can create an account or log in; no vehicle data or app screens are reachable without authentication.

### Authenticated User

- **Main sections / tabs:**
  - **Garage**: list of the user's vehicles with their current status
  - **Upcoming**: services that are due soon or overdue across all vehicles, sorted by urgency
  - **Profile**: account email, number of vehicles, total amount spent, and Logout
- **Details screens:**
  - **Vehicle Details**: photo, make/model/year, plate, fuel type, current mileage, status, next service, total cost, and the vehicle's service history
  - **Record Details**: type, category, date, mileage, cost, notes, receipt photo and reminder information of a single service record
- **Create / Edit / Delete actions:**
  - **Vehicles:** add a new vehicle, edit its data (including the current mileage and photo), delete it (with confirmation; its records are deleted too)
  - **Service records:** add a record to a vehicle, edit it, delete it (with confirmation)
  - Users can only see and modify their own data (enforced by Firestore security rules).

## 3. Authentication & Session Handling

### Authentication Flow

1. **App start:** The app checks that Firebase is configured and initializes Firebase Auth. While Firebase restores any saved session, a loading screen ("Restoring your session...") is shown.
2. **Authentication check:** `AuthContext` subscribes to Firebase's `onAuthStateChanged`. When it reports a user, the user is stored in context; when it reports `null`, the user is treated as a guest.
3. **Successful login or registration:** Firebase signs the user in (`signInWithEmailAndPassword` / `createUserWithEmailAndPassword`). `onAuthStateChanged` fires with the new user, and the root navigator automatically switches from the Auth stack to the main app tabs.
4. **Logout:** The user taps **Log out** on the Profile tab. `signOut` clears the Firebase session and the stored credentials, `onAuthStateChanged` fires with `null`, and the root navigator switches back to the Login screen.

### Session Persistence

- **How is the user session stored?** Firebase Auth is initialized with a custom persistence layer (`getReactNativePersistence`) backed by **`expo-secure-store`**, so the session tokens are kept encrypted in the Android Keystore / iOS Keychain, **not in AsyncStorage**. The adapter converts Firebase's storage keys to the characters SecureStore allows and splits large values into chunks.
- **How is automatic login handled after app restart?** On startup Firebase reads the saved session from secure storage and refreshes the ID token if needed. `onAuthStateChanged` then reports the restored user and the app opens directly on the Garage tab, without showing the Login screen.

## 4. Navigation Structure

### Root Navigation Logic

A root **Native Stack** renders exactly one branch based on the auth state from `AuthContext`:

- no user → **Auth stack** (Login, Register)
- logged-in user → **App tabs**

Because the app screens are not registered at all while logged out, they cannot be reached manually without a valid session (protected routes).

### Main Navigation

- **Bottom Tab Navigator** with **3 tabs:** Garage, Upcoming, Profile.

### Nested Navigation

- **Is there nested navigation?** Yes. The **Garage** tab contains its own **Native Stack** (a Stack inside a Tab, inside the root Stack). The Upcoming tab also navigates into the Garage stack to open a vehicle's details.
- **What type of screens are included?**
  - Auth stack: `Login`, `Register`
  - Garage stack: `VehicleList` → `VehicleDetails` → `RecordDetails`, plus `VehicleForm` (add/edit) and `RecordForm` (add/edit)
  - Tabs: `Upcoming`, `Profile`
  - Dynamic screens (built from route params): `VehicleDetails`, `RecordDetails`, `VehicleForm` (edit mode), `RecordForm`

## 5. List → Details Flow

### List / Overview Screen

- **What type of data is displayed?** The **Garage** list (`FlatList`) shows the user's vehicles loaded from Firestore. Each card shows the photo, make and model, plate, current mileage and a colored status badge (OK / Due soon / Overdue). The **Vehicle Details** screen contains a second list: the vehicle's service records, newest first.
- **How does the user interact with the list?** Tap a card to open its details, **pull down to refresh** the list from Firestore, and use the "+" button to add a new vehicle or record.

### Details Screen

- **How is navigation triggered?** Tapping a vehicle card calls `navigation.navigate('VehicleDetails', { vehicleId })`. Tapping a service record calls `navigation.navigate('RecordDetails', { vehicleId, recordId })`.
- **What data is received via route parameters?** Only the IDs (`vehicleId`, and `recordId` for records). The details screen uses them to fetch the latest document from Firestore, so it always shows fresh data. The form screens receive the same IDs to switch between **add** and **edit** mode.

## 6. Data Source & Backend

### Backend Type

- [ ] **Simulated backend:** MockAPI / DummyJSON
- [x] **Real backend:** Firebase

**Backend details:**

- **Firebase Authentication:** email/password accounts.
- **Cloud Firestore:** stores all app data per user:

  ```
  users/{uid}/vehicles/{vehicleId}
      make, model, year, plate, fuelType, photoUrl, currentMileage,
      nextServiceDate, nextServiceMileage, createdAt, updatedAt
  users/{uid}/vehicles/{vehicleId}/records/{recordId}
      type, category, title, date, mileage, cost, notes, receiptPhotoUrl,
      setsReminder, nextDueDate, nextDueMileage, createdAt
  ```

- **Photos:** vehicle and receipt photos are uploaded to cloud storage, and their download URL is saved on the document.
- Security rules allow each user to read and write only their own `users/{uid}` subtree.

## 7. Data Operations (CRUD)

### Read (GET)

- `VehicleList`: `getDocs` on `users/{uid}/vehicles`, ordered by creation date.
- `VehicleDetails`: `getDoc` for the vehicle plus `getDocs` on its `records` subcollection, ordered by date.
- `RecordDetails`: `getDoc` for a single record.
- `Upcoming`: the user's vehicles that have a next service set, sorted by urgency.
- All lists support pull-to-refresh and are reloaded when the screen regains focus.

### Create (POST)

- **Add Vehicle** form → `addDoc` into `vehicles`.
- **Add Record** form → a Firestore **`writeBatch`** that adds the record and updates the parent vehicle in one atomic operation (raises `currentMileage` if the record's mileage is higher, and stores the new next-service date/mileage when a reminder is set).

### Update / Delete (Mutation)

- **Which operation is implemented?** Both.
  - **Update:** edit a vehicle (`updateDoc`), including its mileage and photo; edit a service record (batch update of the record and the vehicle's mileage/next service).
  - **Delete:** delete a service record (`deleteDoc`); delete a vehicle together with all its records (batch delete). Both ask for confirmation first.
- **How is the UI updated after the change?** After a successful write the form navigates back, and the previous screen reloads its data when it regains focus, so the list and details always match Firestore. While saving, the submit button shows a spinner and is disabled to prevent double submissions.

**Mileage rule:** a vehicle's `currentMileage` never decreases automatically. Adding or editing a record only raises it, and deleting a record does not lower it.

## 8. Forms & Validation

### Forms Used

- **Login form**: email, password
- **Register form**: email, password, confirm password
- **Vehicle form (add/edit)**: make, model, year, plate, fuel type (**Picker**), current mileage, photo (**Image Picker**)
- **Service record form (add/edit)**: type and category (**Picker**), title, date (**DateTimePicker**), mileage, cost, notes, receipt photo, "Set reminder" (**Switch**), service interval in km (**Slider**, 1,000–30,000 km), next due date (**DateTimePicker**)

### Validation Rules

- **Email:** required; valid email format.
- **Vehicle make / model:** required; 2–30 characters.
- **Year:** required; whole number; between 1950 and next year.
- **Plate number:** required; 4–10 characters; only letters, digits, spaces and dashes.
- **Field with multiple validation rules:**
  - **Password:** required + at least 6 characters + must contain at least one digit.
  - **Confirm password:** required + must match the password.
  - **Record mileage:** required + whole number + not negative + at most 2,000,000 km.
  - **Next due date** (when a reminder is on): required + must be after the service date.
- **Cost:** optional; if filled, a number ≥ 0 with at most 2 decimals.

Errors appear under each field, and the submit button stays disabled until the form is valid.

## 9. Native Device Features

### Used Native Feature(s)

- [x] Camera / Image Picker
- [ ] Location / Maps
- [ ] Biometrics
- [ ] Sensors

### Usage Description

- **Where is it used?** In the **Vehicle form** (vehicle photo) and the **Service record form** (receipt photo).
- **What functionality does it provide?** The user chooses **Take photo** (camera) or **Choose from gallery**. The app asks for permission, lets the user crop the image, uploads it and saves its URL on the vehicle or record. The vehicle photo appears on the Garage list and the Vehicle Details screen. The receipt photo appears on Record Details, so the user keeps proof of each repair. If permission is denied, the app explains why it is needed and the form can still be saved without a photo.

## 10. Typical User Flow

1. The user opens GarageBook for the first time, taps **Create account**, and registers with email and password. They land on the empty **Garage** tab.
2. They tap **Add vehicle**, fill in make, model, year, plate, fuel type and current mileage, take a photo of the car, and save. The car appears in the list with status **OK**.
3. They open the car and tap **Add service record** ("Oil change"), set the date and mileage, enter the cost, photograph the receipt, turn on **Set reminder** and choose a 15,000 km interval with the slider. The vehicle now shows its next service.
4. Over time the user updates the mileage or logs repairs. When a service gets close, the car is marked **Due soon** (and later **Overdue**) on the Garage and **Upcoming** tabs. The user can edit or delete wrong records at any time.
5. The user closes the app. When they reopen it, they are still logged in and go straight to their garage. They log out from the **Profile** tab.

## 11. Error & Edge Case Handling

- **Authentication errors:** Firebase error codes are mapped to clear messages shown on the form, for example "Wrong email or password" (`auth/invalid-credential`), "This email is already registered" (`auth/email-already-in-use`), "Too many attempts, try again later" (`auth/too-many-requests`) and "No internet connection" (`auth/network-request-failed`). The submit button shows a loading state while the request runs.
- **Network or data errors:** Every screen that loads data has **loading**, **error** and **success** states. If loading fails, an error message with a **Retry** button is shown. Failed saves or deletes show an alert and keep the form data so nothing is lost. If a vehicle or record no longer exists (e.g. deleted on another device), the details screen shows "Not found" and a button to go back. If the app starts without a Firebase configuration, it shows a setup message instead of crashing.
- **Empty or missing data states:** An empty garage shows "No vehicles yet" with an **Add your first vehicle** button. A vehicle without records shows "No service history yet". The Upcoming tab shows "All caught up 🎉" when nothing is due. Missing optional data (no photo, no cost, no reminder) is shown with placeholders such as a default car icon or "Not set".
