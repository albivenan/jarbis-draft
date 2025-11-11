// src/custom.d.ts

declare module '@ckeditor/ckeditor5-build-classic' {
  // Deklarasikan variabel global jika perlu, tapi seringkali ini sudah cukup
  // Anda bisa membuat tipe yang lebih spesifik jika ingin
  const ClassicEditor: any; // Tipe dasar, bisa dispesifikasi lebih lanjut
  export default ClassicEditor;
}