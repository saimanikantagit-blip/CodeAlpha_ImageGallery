/* Gallery content lives here so images and captions are easy to replace. */
const photographs = [
  { title: 'Where the mountains breathe', category: 'Nature', alt: 'Mountain peaks reflected in a still alpine lake at dawn', src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1100&q=82' },
  { title: 'A quieter kind of blue', category: 'Travel', alt: 'Turquoise water along a rugged Mediterranean coastline', src: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1100&q=82' },
  { title: 'Lines in the light', category: 'Architecture', alt: 'Minimal concrete architecture framed against a pale sky', src: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1100&q=82' },
  { title: 'The long way home', category: 'Travel', alt: 'Winding road crossing a green mountain valley', src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1100&q=82' },
  { title: 'A moment in between', category: 'Portraits', alt: 'Thoughtful portrait of a woman in warm natural light', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1100&q=82' },
  { title: 'Soft edge of morning', category: 'Nature', alt: 'Early morning mist resting over a forested mountain range', src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1100&q=82' },
  { title: 'The city, unfolding', category: 'Architecture', alt: 'Warmly lit historic city buildings viewed from above', src: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1100&q=82' },
  { title: 'Salt in the air', category: 'Travel', alt: 'Small white coastal village overlooking calm blue water', src: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1100&q=82' },
  { title: 'Wild, unhurried', category: 'Nature', alt: 'Sunlight falling across a field of wild grasses and flowers', src: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1100&q=82' },
  { title: 'A face in the crowd', category: 'Portraits', alt: 'Candid portrait of a man looking toward the afternoon light', src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1100&q=82' },
  { title: 'Built for the sky', category: 'Architecture', alt: 'Sculptural modern building rising above the city', src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1100&q=82' },
  { title: 'Between departures', category: 'Travel', alt: 'A train platform stretching into the distance in soft light', src: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1100&q=82' },
  { title: 'After the rain', category: 'Nature', alt: 'Rain-washed tropical leaves catching soft daylight', src: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1100&q=82' },
  { title: 'Golden hour, held', category: 'Portraits', alt: 'Close portrait in golden hour light against a quiet background', src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1100&q=82' },
  { title: 'The shape of stillness', category: 'Architecture', alt: 'Quiet geometric facade with repeating windows and shadows', src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1100&q=82' },
  { title: 'A little further north', category: 'Travel', alt: 'Remote mountain cabin beside a glassy lake', src: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1100&q=82' },
  { title: 'Small things, growing', category: 'Nature', alt: 'Close detail of a small green plant in natural light', src: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1100&q=82' },
  { title: 'A study in softness', category: 'Portraits', alt: 'Natural light portrait with a soft, contemplative expression', src: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1100&q=82' }
];

const grid = document.querySelector('#gallery-grid');
const heroImage = document.querySelector('.hero-image img');
const filters = document.querySelector('#filters');
const count = document.querySelector('#image-count');
const lightbox = document.querySelector('#lightbox');
const viewerImage = document.querySelector('#lightbox-image');
const viewerTitle = document.querySelector('#lightbox-title');
const viewerCategory = document.querySelector('#lightbox-category');
const viewerCounter = document.querySelector('#lightbox-counter');
const closeButton = document.querySelector('.lightbox-close');
const categories = ['All', ...new Set(photographs.map((photo) => photo.category))];
let selectedCategory = 'All';
let visiblePhotos = photographs;
let currentIndex = 0;
let returnFocus = null;

heroImage.src = photographs[0].src.replace('w=1100', 'w=1800');
heroImage.alt = photographs[0].alt;

function safeImage(image) {
  image.addEventListener('error', () => {
    image.classList.add('image-failed');
    if (!image.parentElement.querySelector('.image-fallback')) {
      const fallback = document.createElement('span');
      fallback.className = 'image-fallback';
      fallback.textContent = 'IMAGE UNAVAILABLE';
      image.parentElement.append(fallback);
    }
  });
}

function renderFilters() {
  filters.replaceChildren();
  categories.forEach((category) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-button';
    button.textContent = category;
    button.setAttribute('aria-pressed', String(category === selectedCategory));
    button.addEventListener('click', () => {
      selectedCategory = category;
      visiblePhotos = category === 'All' ? photographs : photographs.filter((photo) => photo.category === category);
      renderFilters();
      renderGallery();
    });
    filters.append(button);
  });
}

function renderGallery() {
  grid.replaceChildren();
  count.textContent = `${String(visiblePhotos.length).padStart(2, '0')} ${visiblePhotos.length === 1 ? 'IMAGE' : 'IMAGES'}`;
  if (!visiblePhotos.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = '<strong>Nothing in this frame yet.</strong><p>Choose another category to keep exploring.</p>';
    grid.append(empty);
    return;
  }
  visiblePhotos.forEach((photo, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'gallery-card';
    card.setAttribute('aria-label', `View ${photo.title}, ${photo.category}`);
    const imageFrame = document.createElement('span');
    imageFrame.className = 'card-image';
    const image = document.createElement('img');
    image.src = photo.src;
    image.alt = photo.alt;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.width = 1100;
    image.height = 900;
    const overlay = document.createElement('span');
    overlay.className = 'card-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    const zoom = document.createElement('span');
    zoom.className = 'zoom-mark';
    zoom.textContent = '↗';
    overlay.append(zoom);
    imageFrame.append(image, overlay);
    const caption = document.createElement('span');
    caption.className = 'card-caption';
    const title = document.createElement('span');
    title.className = 'card-title';
    title.textContent = photo.title;
    const categoryLabel = document.createElement('span');
    categoryLabel.textContent = photo.category.toUpperCase();
    caption.append(title, categoryLabel);
    card.append(imageFrame, caption);
    safeImage(image);
    const open = () => openLightbox(index, card);
    card.addEventListener('click', open);
    grid.append(card);
  });
}

function showPhoto() {
  const photo = visiblePhotos[currentIndex];
  viewerImage.classList.remove('image-failed');
  lightbox.querySelector('.image-fallback')?.remove();
  viewerImage.src = photo.src.replace('w=1100', 'w=1800');
  viewerImage.alt = photo.alt;
  viewerTitle.textContent = photo.title;
  viewerCategory.textContent = photo.category.toUpperCase();
  viewerCounter.textContent = `${currentIndex + 1} / ${visiblePhotos.length}`;
  document.querySelector('.lightbox-prev').disabled = visiblePhotos.length < 2;
  document.querySelector('.lightbox-next').disabled = visiblePhotos.length < 2;
}

function openLightbox(index, trigger) {
  currentIndex = index;
  returnFocus = trigger;
  showPhoto();
  lightbox.inert = false;
  lightbox.setAttribute('aria-hidden', 'false');
  lightbox.classList.add('is-open');
  document.body.classList.add('no-scroll');
  closeButton.focus();
}

function closeLightbox() {
  if (!lightbox.classList.contains('is-open')) return;
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.inert = true;
  document.body.classList.remove('no-scroll');
  viewerImage.removeAttribute('src');
  returnFocus?.focus();
}

function movePhoto(step) {
  currentIndex = (currentIndex + step + visiblePhotos.length) % visiblePhotos.length;
  showPhoto();
}

renderFilters();
renderGallery();
safeImage(viewerImage);
document.querySelector('.lightbox-prev').addEventListener('click', () => movePhoto(-1));
document.querySelector('.lightbox-next').addEventListener('click', () => movePhoto(1));
closeButton.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (event) => {
  if (!lightbox.classList.contains('is-open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') { event.preventDefault(); movePhoto(-1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); movePhoto(1); }
  if (event.key === 'Tab') {
    const focusable = [...lightbox.querySelectorAll('button:not(:disabled)')];
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

// Keep swipe gestures confined to the viewer, with a modest threshold to avoid accidental changes.
let touchStartX = null;
lightbox.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', (event) => {
  if (touchStartX === null) return;
  const delta = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 60) movePhoto(delta > 0 ? -1 : 1);
  touchStartX = null;
}, { passive: true });
