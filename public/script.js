const url = 'https://berita-indo-api.vercel.app/v1/cnn-news'; // Ganti dengan URL API yang benar
let savedArticles = []; // Array untuk menyimpan artikel yang disimpan

async function fetchNews(searchTerm = '') {
    const loadingIndicator = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const newsContainer = document.getElementById('news-container');
    const popularNewsContainer = document.getElementById('popular-news-container');
    const recommendedNewsContainer = document.getElementById('recommended-news-container');
    const latestNewsContainer = document.getElementById('latest-news-container');

    // Tampilkan loading indicator
    loadingIndicator.style.display = 'block';
    errorMessage.innerHTML = ''; // Reset pesan kesalahan
    newsContainer.innerHTML = ''; // Reset kontainer berita
    popularNewsContainer.innerHTML = ''; // Reset kontainer berita terpopuler
    recommendedNewsContainer.innerHTML = ''; // Reset kontainer berita rekomendasi
    latestNewsContainer.innerHTML = ''; // Reset kontainer berita terbaru

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data); // Log data yang diterima dari server

        // Periksa apakah data ada dan memiliki struktur yang benar
        if (!data || !data.data || data.data.length === 0) {
            errorMessage.innerHTML = 'Tidak ada berita yang ditemukan.';
            return;
        }

        // Filter berita berdasarkan kata kunci pencarian
        const filteredArticles = data.data.filter(article => {
            const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  article.contentSnippet.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch; // Hanya memeriksa pencarian
        });

        // Tampilkan berita utama
        filteredArticles.forEach(article => {
            const articleDiv = document.createElement('div');
            articleDiv.classList.add('article');

            const imageUrl = article.image?.large || ''; // Mengambil URL gambar besar
            const articleUrl = article.link || '#'; // Mengambil URL artikel
            articleDiv.innerHTML = `
                <h2>${article.title}</h2>
                ${imageUrl ? `<img src="${imageUrl}" alt="${article.title}">` : ''}
                <p>${article.contentSnippet || 'Deskripsi tidak tersedia.'}</p>
                <button class="save-button" data-url="${articleUrl}">Simpan</button>
                <button class="share-button" data-url="${articleUrl}">Bagikan</button>
                <a href="${articleUrl}" target="_blank">Baca Selengkapnya</a>
            `;
            newsContainer.appendChild(articleDiv);
        });

        if (filteredArticles.length === 0) {
            errorMessage.innerHTML = 'Tidak ada berita yang cocok dengan pencarian.';
        }

        // Tampilkan berita terpopuler (misalnya, 3 berita pertama)
        const popularArticles = data.data.slice(0, 3); // Ambil 3 berita pertama sebagai terpopuler
        popularArticles.forEach(article => {
            const popularDiv = document.createElement('div');
            popularDiv.classList.add('popular-article');

            const imageUrl = article.image?.small || ''; // Mengambil URL gambar kecil
            const articleUrl = article.link || '#'; // Mengambil URL artikel
            popularDiv.innerHTML = `
                <h3>${article.title}</h3>
                ${imageUrl ? `<img src="${imageUrl}" alt="${article.title}">` : ''}
                <p>${article.contentSnippet || 'Deskripsi tidak tersedia.'}</p>
                <a href="${articleUrl}" target="_blank">Baca Selengkapnya</a>
            `;
            popularNewsContainer.appendChild(popularDiv);
        });

        // Tampilkan berita rekomendasi (misalnya, 3 berita pertama)
        const recommendedArticles = data.data.slice(0, 3); // Ambil 3 berita pertama sebagai rekomendasi
        recommendedArticles.forEach(article => {
            const recommendedDiv = document.createElement('div');
            recommendedDiv.classList.add('recommended-article');

            const imageUrl = article.image?.small || ''; // Mengambil URL gambar kecil
            const articleUrl = article.link || '#'; // Mengambil URL artikel
            recommendedDiv.innerHTML = `
                <h3>${article.title}</h3>
                ${imageUrl ? `<img src="${imageUrl}" alt="${article.title}">` : ''}
                <p>${article.contentSnippet || 'Deskripsi tidak tersedia.'}</p>
                <a href="${articleUrl}" target="_blank">Baca Selengkapnya</a>
            `;
            recommendedNewsContainer.appendChild(recommendedDiv);
        });

        // Tampilkan berita terbaru (misalnya, 3 berita terakhir)
        const latestArticles = data.data.slice(-3); // Ambil 3 berita terakhir
        latestArticles.forEach(article => {
            const latestDiv = document.createElement('div');
            latestDiv.classList.add('latest-article');

            const imageUrl = article.image?.small || ''; // Mengambil URL gambar kecil
            const articleUrl = article.link || '#'; // Mengambil URL artikel
            latestDiv.innerHTML = `
                <h3>${article.title}</h3>
                ${imageUrl ? `<img src="${imageUrl}" alt="${article.title}">` : ''}
                <p>${article.contentSnippet || 'Deskripsi tidak tersedia.'}</p>
                <a href="${articleUrl}" target="_blank">Baca Selengkapnya</a>
            `;
            latestNewsContainer.appendChild(latestDiv);
        });

    } catch (error) {
        console.error('Error fetching news:', error);
        errorMessage.innerHTML = 'Terjadi kesalahan saat mengambil berita.';
    } finally {
        // Sembunyikan loading indicator
        loadingIndicator.style.display = 'none';
    }
}

// Panggil fungsi untuk mengambil berita saat halaman dimuat
fetchNews();

// Tambahkan event listener untuk pencarian
document.getElementById('search-input').addEventListener('input', (event) => {
    const searchTerm = event.target.value;
    fetchNews(searchTerm); // Panggil fungsi fetchNews dengan kata kunci pencarian
});

// Event listener untuk tombol simpan
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('save-button')) {
        const articleUrl = event.target.getAttribute('data-url');
        if (!savedArticles.includes(articleUrl)) {
            savedArticles.push(articleUrl);
            alert('Berita telah disimpan!');
        } else {
            alert('Berita sudah disimpan sebelumnya.');
        }
    }

    // Event listener untuk tombol berbagi
    if (event.target.classList.contains('share-button')) {
        const articleUrl = event.target.getAttribute('data-url');
        navigator.clipboard.writeText(articleUrl).then(() => {
            alert('Tautan berita telah disalin ke clipboard!');
        });
    }
});
