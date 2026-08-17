# PRD & TODO: Fitur CRUD Leads — Aplikasi CRM Mobile (React Native)

**Versi dokumen:** 1.0
**Tanggal:** 14 Agustus 2026
**Stack:** React Native 0.81.1 (New Architecture), React 19.1.0, TypeScript, axios 1.12.2, crypto-js 4.2.0
**Konteks penggunaan:** Dokumen ini dirancang untuk dipakai sebagai instruksi kerja AI coding agent DAN sebagai checklist review manusia. Setiap task punya kriteria "Definition of Done" yang bisa dicek manual sebelum lanjut ke task berikutnya.

---

## 1. Latar Belakang & Tujuan

Membangun modul CRUD (Create, Read, Update, Delete) untuk entitas **Leads** (prospek/calon customer) sebagai fondasi awal aplikasi CRM mobile. Modul ini menjadi referensi pola (pattern) yang akan direplikasi untuk entitas lain (Customers, Tickets, dll) — sehingga arsitekturnya harus **reusable**, bukan hardcode satu per satu.

**Tujuan utama:**
- Fitur CRUD Leads berjalan penuh (list, detail, tambah, edit, hapus)
- Kode bisa direview dan dipahami sepenuhnya oleh developer (bukan black-box hasil AI)
- Arsitektur reusable — pola yang sama bisa dipakai ulang untuk entitas CRM lain tanpa duplikasi kode
- Keamanan data menjadi syarat wajib, bukan tambahan di akhir

---

## 2. Scope

### In-scope
- CRUD data Leads (nama, email, telepon, status, sumber lead, catatan, tanggal dibuat)
- Autentikasi dasar (login, simpan token aman, logout, auto-redirect kalau belum login)
- List Leads dengan search & filter status
- Validasi form di sisi client
- Error handling & loading state yang konsisten

### Out-of-scope (fase ini)
- Role-based permission kompleks (multi-role granular)
- Notifikasi push
- Sinkronisasi offline-first
- Backend/API server (asumsi API sudah tersedia atau memakai mock API sementara)

---

## 3. User Stories

| ID | Sebagai | Saya ingin | Supaya |
|---|---|---|---|
| US-1 | Sales rep | Login ke aplikasi | Bisa mengakses data leads dengan aman |
| US-2 | Sales rep | Melihat daftar leads | Tahu prospek mana yang perlu ditindaklanjuti |
| US-3 | Sales rep | Mencari & memfilter leads | Cepat menemukan lead tertentu tanpa scroll manual |
| US-4 | Sales rep | Menambah lead baru | Mencatat prospek baru saat di lapangan |
| US-5 | Sales rep | Mengubah data/status lead | Memperbarui progres tindak lanjut |
| US-6 | Sales rep | Menghapus lead | Membersihkan data yang tidak relevan/duplikat |

---

## 4. Functional Requirements

### 4.1 Autentikasi
- FR-1: User login dengan email + password
- FR-2: Token disimpan menggunakan penyimpanan aman (bukan AsyncStorage biasa untuk data sensitif)
- FR-3: Auto-redirect ke Login jika token tidak ada/kadaluarsa
- FR-4: Logout menghapus token dan state user sepenuhnya

### 4.2 List & Detail Leads
- FR-5: Tampilkan daftar leads dalam list yang efisien (virtualized list, bukan ScrollView biasa untuk data banyak)
- FR-6: Search berdasarkan nama (debounced, tidak fetch di setiap ketikan)
- FR-7: Filter berdasarkan status (Baru, Diproses, Closed)
- FR-8: Tap item → buka detail lead

### 4.3 Create & Update
- FR-9: Form tambah lead dengan validasi (nama & email wajib, format email valid, telepon numerik)
- FR-10: Form edit lead menggunakan komponen form yang SAMA dengan form tambah (reusable, bukan duplikat)
- FR-11: Tampilkan loading state saat submit, disable tombol submit selama proses berjalan
- FR-12: Tampilkan feedback sukses/gagal (toast/snackbar) setelah submit

### 4.4 Delete
- FR-13: Konfirmasi dialog sebelum menghapus (mencegah hapus tidak sengaja)
- FR-14: Optimistic update atau refresh list setelah hapus berhasil

---

## 5. Non-Functional Requirements (Security — MANDATORY)

Ini bukan opsional. Setiap poin berikut WAJIB dicek sebelum task terkait dianggap selesai:

| ID | Requirement | Kenapa wajib |
|---|---|---|
| SEC-1 | Token autentikasi disimpan di secure storage (Keychain/Keystore via library seperti `react-native-keychain`), BUKAN AsyncStorage polos | AsyncStorage tidak terenkripsi, bisa dibaca kalau device di-root/jailbreak |
| SEC-2 | Semua request ke API menggunakan HTTPS, tolak koneksi HTTP di kode | Mencegah data tersadap di jaringan publik |
| SEC-3 | Data sensitif yang perlu disimpan lokal (bukan token) dienkripsi menggunakan `crypto-js` sebelum disimpan | Lapisan pertahanan tambahan kalau storage device diakses paksa |
| SEC-4 | Tidak ada credential/API key hardcoded di source code — gunakan environment variable (`.env` + `react-native-config` atau setara) | Mencegah kebocoran credential lewat repo/APK decompile |
| SEC-5 | Validasi input dilakukan di client DAN diasumsikan tetap divalidasi ulang di server (client-side validation bukan satu-satunya pertahanan) | Mencegah asumsi keliru bahwa validasi client saja cukup |
| SEC-6 | Axios instance menggunakan interceptor untuk auto-attach token & auto-handle token expired (401) secara terpusat, bukan manual di tiap request | Konsistensi keamanan, mencegah lupa attach token di satu tempat |
| SEC-7 | Tidak ada `console.log` yang mencetak data sensitif (token, password) yang tertinggal di build production | Kebocoran data lewat log device |
| SEC-8 | Sanitasi input yang ditampilkan kembali ke UI (mencegah injection pada field seperti catatan/notes) | Defense-in-depth walau React Native tidak serentan XSS seperti web |

---

## 6. Prinsip Arsitektur (Wajib Diikuti AI Agent)

1. **DRY (Don't Repeat Yourself):** Logic fetch/create/update/delete HARUS lewat 1 service layer per entitas (`leadsService.ts`), dipanggil lewat 1 custom hook (`useLeads.ts`) — dilarang menulis ulang fetch logic di tiap screen.
2. **Reusable components:** Form tambah dan edit WAJIB pakai component form yang sama (`LeadForm.tsx`), dibedakan lewat props/mode, bukan 2 file terpisah yang isinya mirip.
3. **Reusable API client:** Satu axios instance terpusat (`apiClient.ts`) dengan interceptor, dipakai semua service — dilarang bikin `axios.create()` baru di tiap file.
4. **Type-safe:** Semua data (Lead, User, API response) punya interface TypeScript yang jelas di `types/`, dipakai konsisten di semua layer.
5. **Separation of concerns:** Component (UI) tidak boleh berisi logic fetch API langsung — harus lewat hook.

---

## 7. Struktur Folder yang Harus Diikuti

```
src/
├── features/
│   ├── auth/
│   │   ├── screens/LoginScreen.tsx
│   │   ├── hooks/useAuth.ts
│   │   ├── services/authService.ts
│   │   └── types.ts
│   └── leads/
│       ├── screens/
│       │   ├── LeadsListScreen.tsx
│       │   ├── LeadDetailScreen.tsx
│       │   └── LeadFormScreen.tsx      # dipakai utk create & edit
│       ├── components/
│       │   ├── LeadCard.tsx
│       │   ├── LeadForm.tsx             # reusable form
│       │   └── LeadFilterBar.tsx
│       ├── hooks/useLeads.ts
│       ├── services/leadsService.ts
│       └── types.ts
├── shared/
│   ├── components/ (Button, Input, LoadingSpinner, ConfirmDialog, Toast)
│   ├── hooks/ (useDebounce)
│   └── contexts/AuthContext.tsx
├── services/
│   ├── apiClient.ts                     # axios instance + interceptor
│   └── secureStorage.ts                 # wrapper Keychain
├── navigation/AppNavigator.tsx
├── types/ (global types)
└── constants/
```

---

## 8. TODO — Step by Step

Setiap step ditulis sebagai instruksi yang bisa langsung diberikan ke AI agent, DIIKUTI dengan checklist review manual sebelum lanjut ke step berikutnya.

### FASE 0 — Persiapan

- [ ] **0.1** Install dependency tambahan yang dibutuhkan: `react-native-keychain`, `@react-navigation/native` + stack navigator, `react-native-config` (env variable)
  - ✅ Review: cek `package.json`, pastikan versi kompatibel dengan New Architecture (cek react-native-directory.com)
- [ ] **0.2** Setup `.env` untuk `API_BASE_URL`, pastikan `.env` masuk `.gitignore`
  - ✅ Review: pastikan tidak ada URL/key hardcoded di source code

### FASE 1 — Fondasi (Service Layer & Types)

- [ ] **1.1** Buat `types/Lead.ts` — interface `Lead { id, nama, email, telepon, status, sumber, catatan, createdAt }`
  - ✅ Review: semua field production yang dibutuhkan sudah tercakup, tipe data sesuai (status pakai union type, bukan string bebas)
- [ ] **1.2** Buat `services/apiClient.ts` — axios instance dengan base URL dari env, interceptor request (attach token) dan response (handle 401 → logout otomatis)
  - ✅ Review: **cek SEC-6** — pastikan interceptor benar-benar attach token otomatis, tidak ada request lain yang manual set header
- [ ] **1.3** Buat `services/secureStorage.ts` — wrapper sederhana untuk simpan/baca/hapus token via `react-native-keychain`
  - ✅ Review: **cek SEC-1** — pastikan TIDAK ada penggunaan `AsyncStorage` untuk token di file manapun
- [ ] **1.4** Buat `features/leads/services/leadsService.ts` — fungsi `getLeads()`, `getLeadById(id)`, `createLead(data)`, `updateLead(id, data)`, `deleteLead(id)`, semua pakai `apiClient`
  - ✅ Review: **cek prinsip DRY** — pastikan tidak ada `axios.create()` baru di file ini, semua lewat `apiClient` yang sama

### FASE 2 — Autentikasi

- [ ] **2.1** Buat `contexts/AuthContext.tsx` — state `user`, `isLoading`, fungsi `login()`, `logout()`, cek token tersimpan saat app dibuka (`useEffect`)
  - ✅ Review: pastikan `login()` panggil `secureStorage`, bukan simpan token manual di state saja
- [ ] **2.2** Buat `LoginScreen.tsx` — form email/password, validasi input, loading state saat submit
  - ✅ Review: **cek SEC-5** — validasi format email, field tidak boleh kosong; **cek SEC-7** — tidak ada `console.log(password)` atau sejenisnya
- [ ] **2.3** Setup `AppNavigator.tsx` — conditional rendering: kalau `user` null → Login stack, kalau ada → Main stack (protected navigation)
  - ✅ Review: coba manual hapus token dari storage, pastikan app benar-benar redirect ke Login saat dibuka ulang

### FASE 3 — List & Search Leads

- [ ] **3.1** Buat `hooks/useLeads.ts` — custom hook yang bungkus `leadsService`, kembalikan `{ leads, isLoading, error, refetch, searchQuery, setSearchQuery, filterStatus, setFilterStatus }`
  - ✅ Review: cek apakah filter/search dilakukan pakai `useMemo` (bukan filter ulang tiap render tanpa alasan)
- [ ] **3.2** Buat `shared/hooks/useDebounce.ts` — generic debounce hook untuk search input
  - ✅ Review: pastikan search TIDAK memicu fetch API di setiap ketikan huruf (cek Network tab / log request)
- [ ] **3.3** Buat `LeadCard.tsx` — component tampilan 1 item lead di list
  - ✅ Review: pastikan component ini murni presentational (terima props, tidak fetch data sendiri)
- [ ] **3.4** Buat `LeadsListScreen.tsx` — pakai `FlatList` (bukan `ScrollView` + `.map()`), integrasikan search bar & filter
  - ✅ Review: cek `FlatList` punya `keyExtractor` yang benar, cek performa scroll dengan data dummy >50 item

### FASE 4 — Form (Create & Update, Reusable)

- [ ] **4.1** Buat `LeadForm.tsx` — SATU component form dipakai untuk create maupun edit, terima props `mode: 'create' | 'edit'` dan `initialData?`
  - ✅ Review: **cek prinsip DRY (poin FR-10)** — pastikan TIDAK ADA file form terpisah untuk create vs edit
- [ ] **4.2** Tambahkan validasi form (nama & email wajib, format email, telepon numerik) — pertimbangkan pakai library seperti `react-hook-form` + `zod` untuk validasi terstruktur
  - ✅ Review: **cek SEC-5** — coba submit form kosong/format salah, pastikan tertolak di client
- [ ] **4.3** Buat `LeadFormScreen.tsx` — wrapper screen yang panggil `LeadForm`, handle submit ke `createLead`/`updateLead` sesuai mode
  - ✅ Review: cek loading state saat submit (tombol disable, ada indikator visual)
- [ ] **4.4** Tambahkan Toast/Snackbar feedback sukses & gagal setelah submit
  - ✅ Review: coba matikan koneksi internet, pastikan pesan error muncul dengan jelas (bukan app crash/diam saja)

### FASE 5 — Delete & Detail

- [ ] **5.1** Buat `ConfirmDialog.tsx` — reusable dialog konfirmasi (dipakai untuk delete, bisa dipakai ulang untuk konfirmasi lain nanti)
  - ✅ Review: cek reusability — pastikan tidak hardcode teks "Hapus Lead" di dalam component, terima props teks/aksi
- [ ] **5.2** Integrasikan tombol delete di `LeadDetailScreen.tsx`, panggil `ConfirmDialog` sebelum eksekusi
  - ✅ Review: **cek FR-13** — pastikan delete TIDAK bisa langsung tereksekusi tanpa konfirmasi
- [ ] **5.3** Refresh list otomatis setelah delete berhasil (refetch atau optimistic update)
  - ✅ Review: cek data yang dihapus benar-benar hilang dari list tanpa perlu manual reload app

### FASE 6 — Review Keamanan & Kualitas Kode (Final Checklist)

- [ ] **6.1** Jalankan ulang seluruh checklist SEC-1 sampai SEC-8 di atas satu per satu
- [ ] **6.2** Cek TypeScript: jalankan `tsc --noEmit`, pastikan tidak ada error, minimalkan penggunaan `any`
- [ ] **6.3** Cek duplikasi kode: apakah ada 2 file yang isinya >70% mirip? Kalau ada, refactor jadi reusable
- [ ] **6.4** Build release sekali (`--mode=release`), pastikan tidak ada `console.log` sensitif ikut ter-bundle
- [ ] **6.5** Manual test end-to-end: login → list → search/filter → tambah → edit → hapus → logout

---

## 9. Cara Kerja dengan AI Agent (Panduan untuk Kamu)

1. **Berikan 1 step dari TODO di atas per prompt ke AI agent** — jangan minta semua fase sekaligus, supaya kamu bisa review tiap potongan kode sebelum lanjut.
2. **Selalu tempelkan checklist "✅ Review" terkait** sebagai instruksi tambahan ke AI, misal: *"Buat leadsService.ts sesuai step 1.4, pastikan semua fungsi pakai apiClient yang sama, jangan buat axios instance baru."*
3. **Setelah AI selesai, jangan langsung lanjut** — baca kodenya, cocokkan dengan checklist review di step itu, dan tanya ke AI kalau ada bagian yang tidak kamu pahami ("jelaskan kenapa kode ini pakai useMemo di baris X").
4. **Kalau AI membuat pola yang berulang** (misal bikin form terpisah untuk create dan edit padahal harusnya 1), tolak hasilnya dan minta AI refactor sesuai prinsip DRY di dokumen ini.
5. **Simpan dokumen ini** sebagai referensi tetap selama development — setiap kali mulai fase baru, tempelkan bagian FR/SEC yang relevan supaya AI agent selalu "ingat" constraint yang wajib dipatuhi.

---

## 10. Definition of Done (Keseluruhan Fitur)

Fitur CRUD Leads dianggap selesai kalau:
- [ ] Semua checklist FASE 0–6 di atas tercentang
- [ ] Tidak ada TODO/FIXME yang tertinggal di kode tanpa penjelasan
- [ ] Kamu (bukan cuma AI) bisa menjelaskan alur data dari UI sampai API untuk fitur create, tanpa membuka kode ulang
- [ ] Semua requirement SEC-1 s.d. SEC-8 lolos manual check
