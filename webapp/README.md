# FP Teori Graf

_The Knight's Tour dan Largest Monotonically Increasing Subsequence (LMIS)_

## Deskripsi Masalah

Program ini dikembangkan untuk memvisualisasikan dua permasalahan algoritma klasik menggunakan pendekatan _Teori Graf_:

### 1. The Knight's Tour (Perjalanan Kuda)

Permasalahan Knight's Tour adalah mencari urutan langkah Kuda pada papan catur sedemikian rupa sehingga setiap kotak dikunjungi _tepat satu kali_.
Dalam teori graf, masalah ini ekuivalen dengan pencarian _Hamiltonian Path_ pada graf yang merepresentasikan langkah legal Kuda.

### 2. Largest Monotonically Increasing Subsequence (LMIS)

Permasalahan LMIS adalah mencari _subsekuens terpanjang_ dari suatu deret bilangan yang tersusun secara menaik.
Program ini memvisualisasikan proses pencarian solusi menggunakan struktur _Tree_, di mana:

- Node merepresentasikan elemen yang dipilih
- Edge merepresentasikan transisi ke elemen berikutnya yang valid (bernilai lebih besar)

---

## Tujuan Program

Program ini dibuat untuk:

1. Memvisualisasikan algoritma secara interaktif dan real-time.
2. Menunjukkan representasi graf dari langkah-langkah algoritma.
3. Membantu analisis kompleksitas serta jalur solusi yang diambil algoritma.

---

## Algoritma yang Digunakan

### The Knight's Tour

Menggunakan algoritma _Backtracking_ yang dioptimasi dengan _Warnsdorff's Rule_:

- Kuda selalu memilih langkah ke kotak dengan jumlah langkah lanjutan paling sedikit (minimum degree).
- Heuristik ini efektif mengurangi backtracking dan mempercepat pencarian solusi.

### LMIS (Tree Approach)

Masalah LMIS diselesaikan dengan pendekatan _decision tree_:

- Root merepresentasikan awal sekuens.
- Edge menghubungkan indeks i ke j dengan syarat i < j dan arr[i] < arr[j].
- Solusi adalah _path terpanjang_ dari root ke leaf.
- Kompleksitas waktu bergantung pada jumlah node dan cabang valid yang dibangkitkan.

---

## Fitur Program

### Visualisasi Knight's Tour

- Klik papan catur untuk menentukan posisi awal Kuda.
- Animasi langkah demi langkah.
- Indikator warna untuk kotak yang telah dikunjungi.

### Visualisasi LMIS

- Input array dinamis dari pengguna.
- Visualisasi struktur Tree secara rekursif.
- Highlight jalur solusi optimal (path terpanjang).
- Statistik kedalaman tree dan total node yang dihasilkan.

---

## Teknologi yang Digunakan

- _Frontend_: React.js, CSS3
- _Algoritma_: JavaScript
- _Struktur Data_: Graph (Adjacency List), Tree
- _Deployment_: Vercel

---

## Cara Mengakses Aplikasi

Aplikasi telah di-deploy dan dapat diakses langsung melalui browser:

🔗 **[https://k13-praktikum-tegraf.vercel.app/](https://k13-praktikum-tegraf.vercel.app/)**
