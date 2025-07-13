# ♿ Disability Support System – Frontend (Angular)

This repository contains the **Angular 19** frontend for the **Disability Support System**, a platform designed to connect **patients with disabilities** to **volunteers (helpers)** who provide essential services.

The frontend communicates with the backend **ASP.NET Core Web API** and offers an intuitive, accessible, and responsive user interface.

---

## 🚀 Features

### 👤 User Features

* Secure registration and login for Patients and Helpers.
* Role-based views and navigation.
* Profile management with ability to update personal information.

### 📜 Patient Features

* Create and manage:

  * **Public Service Offers** for volunteers to apply.
  * **Direct Service Requests** to specific helpers.
* Track service request statuses.
* View helper applications and select providers.
* Make payments via integrated Stripe.

### 🧑‍🔧 Helper Features

* Create and manage **Service Offers**.
* Apply for public patient offers.
* Accept or decline direct requests.
* Manage completed services .

### 📢 Real-time Notifications

* Receive live updates using **SignalR** when:

  * A helper applies to an offer.
  * A patient updates request status.

###

---

## 🏗 Technologies Used

| Technology       | Purpose                         |
| ---------------- | ------------------------------- |
| Angular 19      | Frontend framework (TypeScript) |
| RxJS             | Reactive programming            |
| Bootstrap / SCSS | Styling and responsive design   |
| ngx-toastr       | Notifications and alerts        |
| SignalR Client   | Real-time communication         |
| Stripe.js        | Payment processing              |
| Angular Router   | SPA navigation                  |

---

## ⚙ Setup & Running the Project

1️⃣ Clone the repository:

```
git clone https://github.com/shiiim5/DisabilityPlatformUI.git
cd DisabilityPlatformUI
```

2️⃣ Install dependencies:

``` 
npm install
```

3️⃣ Configure environment:

* Update `environment.ts` with the correct **API Base URL** for backend communication.

Example:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/api'
};
```

4️⃣ Run the Angular app:

```bash
ng serve
```

Access the app at:

```
http://localhost:4200/
```

---

## 👥 Contributors

* Ahmed Abu-elmagd
* Ahmed Hatem
* Aya Elzoghby
* Alaa Elsisy
* Shimaa Aglan

---

## 📌 Future Enhancements

* 🌍 Multi-language support (Arabic/English).
* ⭐ Rating & Review System.
* 📅 Appointment Scheduling Calendar.
* 📊 Admin Dashboard for global system management.
* 🔍 Advanced search and filtering of services.
