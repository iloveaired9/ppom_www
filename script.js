/**
 * Ppomppu Modern - Vanilla JavaScript
 * jQuery 제거된 순수 JavaScript 구현
 */

// ==========================================
// 1. Mock Data - 실제 API와 연결될 부분
// ==========================================

const mockDeals = [
    {
        id: 1,
        title: "쿠팡 와우 멤버십 3개월 70% 할인",
        category: "grocery",
        description: "쿠팡 와우 멤버십 3개월 이용권 할인",
        price: 8900,
        originalPrice: 29700,
        image: "🎁",
        discount: 70,
        likes: 245,
        comments: 38,
        timestamp: "2시간 전",
        liked: false,
    },
    {
        id: 2,
        title: "나이키 에어맥스 온라인 단독 판매 30% OFF",
        category: "fashion",
        description: "2024 신상 스니커즈 한정 판매",
        price: 98000,
        originalPrice: 140000,
        image: "👟",
        discount: 30,
        likes: 512,
        comments: 76,
        timestamp: "5시간 전",
        liked: false,
    },
    {
        id: 3,
        title: "Apple MacBook Air M3 특가",
        category: "electronics",
        description: "256GB SSD, 8GB RAM 모델",
        price: 1299000,
        originalPrice: 1590000,
        image: "💻",
        discount: 18,
        likes: 890,
        comments: 142,
        timestamp: "8시간 전",
        liked: false,
    },
    {
        id: 4,
        title: "제주도 호텔 패키지 2박 3일 50% 할인",
        category: "travel",
        description: "5성급 호텔 + 렌트카 포함",
        price: 450000,
        originalPrice: 900000,
        image: "✈️",
        discount: 50,
        likes: 667,
        comments: 95,
        timestamp: "1일 전",
        liked: false,
    },
    {
        id: 5,
        title: "LG 올레드 TV 77인치 최저가",
        category: "electronics",
        description: "4K UHD, 120Hz 패널",
        price: 2890000,
        originalPrice: 3890000,
        image: "📺",
        discount: 26,
        likes: 423,
        comments: 67,
        timestamp: "2일 전",
        liked: false,
    },
    {
        id: 6,
        title: "UNIQLO 여름 옷 세일 50% OFF",
        category: "fashion",
        description: "전 상품 반값 할인 행사",
        price: 15000,
        originalPrice: 30000,
        image: "👕",
        discount: 50,
        likes: 734,
        comments: 123,
        timestamp: "3일 전",
        liked: false,
    },
    {
        id: 7,
        title: "아마존 프라임 1년 구독 연장 가능",
        category: "electronics",
        description: "무료 배송 + 무제한 스트리밍",
        price: 14900,
        originalPrice: 19900,
        image: "📦",
        discount: 25,
        likes: 556,
        comments: 88,
        timestamp: "4일 전",
        liked: false,
    },
    {
        id: 8,
        title: "한글학원 무료 체험 + 입학금 면제",
        category: "grocery",
        description: "4주 집중 한글 교실",
        price: 0,
        originalPrice: 120000,
        image: "📚",
        discount: 100,
        likes: 178,
        comments: 32,
        timestamp: "5일 전",
        liked: false,
    },
];

// ==========================================
// 2. Application State
// ==========================================

const app = {
    allDeals: [...mockDeals],
    filteredDeals: [...mockDeals],
    currentPage: 1,
    itemsPerPage: 12,
    sortBy: "latest",
    filters: {
        categories: new Set(["all"]),
        special: new Set(),
    },
    searchQuery: "",
    comments: {}, // id => [{ author, content, timestamp }]
};

// ==========================================
// 3. DOM Elements Cache
// ==========================================

const DOM = {
    navToggle: document.getElementById("navToggle"),
    navList: document.querySelector(".nav-list"),
    sidebar: document.getElementById("sidebar"),
    searchForm: document.getElementById("searchForm"),
    searchInput: document.getElementById("searchInput"),
    dealList: document.getElementById("dealList"),
    pagination: document.getElementById("pagination"),
    itemCount: document.getElementById("itemCount"),
    sortSelect: document.getElementById("sortSelect"),
    resetFilters: document.getElementById("resetFilters"),
    dealModal: document.getElementById("dealModal"),
    closeModal: document.getElementById("closeModal"),
    dealDetail: document.getElementById("dealDetail"),
};

// ==========================================
// 4. Event Listeners
// ==========================================

function initEventListeners() {
    // Mobile Navigation Toggle
    if (DOM.navToggle) {
        DOM.navToggle.addEventListener("click", toggleMobileNav);
    }

    // Search Form
    if (DOM.searchForm) {
        DOM.searchForm.addEventListener("submit", handleSearch);
    }

    // Category Filters
    document.querySelectorAll(".category-filter").forEach((checkbox) => {
        checkbox.addEventListener("change", handleCategoryFilter);
    });

    // Sort Buttons & Select
    document.querySelectorAll(".sort-btn").forEach((btn) => {
        btn.addEventListener("click", handleSortClick);
    });

    if (DOM.sortSelect) {
        DOM.sortSelect.addEventListener("change", (e) => {
            app.sortBy = e.target.value;
            filterAndSort();
        });
    }

    // Filter Checkboxes
    document.querySelectorAll(".filter-checkbox").forEach((checkbox) => {
        checkbox.addEventListener("change", handleSpecialFilter);
    });

    // Reset Filters
    if (DOM.resetFilters) {
        DOM.resetFilters.addEventListener("click", resetAllFilters);
    }

    // Modal Close
    if (DOM.closeModal) {
        DOM.closeModal.addEventListener("click", closeModal);
        DOM.dealModal.addEventListener("click", (e) => {
            if (e.target === DOM.dealModal) closeModal();
        });
    }
}

// ==========================================
// 5. Mobile Navigation
// ==========================================

function toggleMobileNav() {
    DOM.navList?.classList.toggle("active");

    // Animate hamburger
    const spans = DOM.navToggle.querySelectorAll("span");
    if (DOM.navList?.classList.contains("active")) {
        spans[0].style.transform = "rotate(45deg) translateY(12px)";
        spans[1].style.opacity = "0";
        spans[2].style.transform = "rotate(-45deg) translateY(-12px)";
    } else {
        spans.forEach((span) => {
            span.style.transform = "";
            span.style.opacity = "";
        });
    }
}

// ==========================================
// 6. Search & Filter Functions
// ==========================================

function handleSearch(e) {
    e.preventDefault();
    app.searchQuery = DOM.searchInput.value.toLowerCase();
    app.currentPage = 1;
    filterAndSort();
}

function handleCategoryFilter(e) {
    if (e.target.value === "all") {
        // "전체" 선택 시 다른 옵션 모두 해제
        document.querySelectorAll(".category-filter").forEach((cb) => {
            cb.checked = e.target.checked;
        });
        if (e.target.checked) {
            app.filters.categories = new Set(["all"]);
        }
    } else {
        // "전체" 체크 해제
        document.querySelector('.category-filter[value="all"]').checked = false;

        if (e.target.checked) {
            app.filters.categories.delete("all");
            app.filters.categories.add(e.target.value);
        } else {
            app.filters.categories.delete(e.target.value);
        }

        // 선택된 카테고리가 없으면 "전체" 선택
        if (app.filters.categories.size === 0) {
            app.filters.categories.add("all");
            document.querySelector('.category-filter[value="all"]').checked = true;
        }
    }

    app.currentPage = 1;
    filterAndSort();
}

function handleSpecialFilter(e) {
    if (e.target.checked) {
        app.filters.special.add(e.target.dataset.filter);
    } else {
        app.filters.special.delete(e.target.dataset.filter);
    }
    app.currentPage = 1;
    filterAndSort();
}

function handleSortClick(e) {
    document.querySelectorAll(".sort-btn").forEach((btn) => {
        btn.setAttribute("aria-pressed", "false");
    });
    e.target.setAttribute("aria-pressed", "true");
    app.sortBy = e.target.dataset.sort;
    DOM.sortSelect.value = app.sortBy;
    filterAndSort();
}

function resetAllFilters() {
    app.searchQuery = "";
    app.sortBy = "latest";
    app.filters.categories = new Set(["all"]);
    app.filters.special = new Set();
    app.currentPage = 1;

    // UI 업데이트
    DOM.searchInput.value = "";
    document.querySelectorAll(".category-filter").forEach((cb) => {
        cb.checked = cb.value === "all";
    });
    document.querySelectorAll(".filter-checkbox").forEach((cb) => {
        cb.checked = false;
    });
    document.querySelectorAll(".sort-btn").forEach((btn) => {
        btn.setAttribute("aria-pressed", btn.dataset.sort === "latest" ? "true" : "false");
    });

    filterAndSort();
}

// ==========================================
// 7. Filter & Sort Logic
// ==========================================

function filterAndSort() {
    // 1. Filter by search query
    let results = app.allDeals.filter((deal) => {
        return (
            deal.title.toLowerCase().includes(app.searchQuery) ||
            deal.description.toLowerCase().includes(app.searchQuery)
        );
    });

    // 2. Filter by category
    if (!app.filters.categories.has("all")) {
        results = results.filter((deal) => app.filters.categories.has(deal.category));
    }

    // 3. Filter by special tags
    if (app.filters.special.size > 0) {
        results = results.filter((deal) => {
            if (app.filters.special.has("hot") && deal.likes < 100) return false;
            if (app.filters.special.has("new") && deal.discount < 30) return false;
            return true;
        });
    }

    // 4. Sort
    results.sort((a, b) => {
        switch (app.sortBy) {
            case "popular":
                return b.likes - a.likes;
            case "recommended":
                return b.likes - a.likes;
            case "comments":
                return b.comments - a.comments;
            case "latest":
            default:
                return b.id - a.id;
        }
    });

    app.filteredDeals = results;
    app.currentPage = 1;

    renderDealList();
    renderPagination();
}

// ==========================================
// 8. Render Functions
// ==========================================

function renderDealList() {
    DOM.dealList.innerHTML = "";

    // 페이지네이션 계산
    const startIdx = (app.currentPage - 1) * app.itemsPerPage;
    const endIdx = startIdx + app.itemsPerPage;
    const pageDeals = app.filteredDeals.slice(startIdx, endIdx);

    // 아이템 개수 표시
    DOM.itemCount.textContent = `총 ${app.filteredDeals.length}개`;

    if (pageDeals.length === 0) {
        DOM.dealList.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <p style="font-size: 18px; color: #666;">검색 결과가 없습니다.</p>
            </div>
        `;
        return;
    }

    pageDeals.forEach((deal) => {
        const card = createDealCard(deal);
        DOM.dealList.appendChild(card);
    });
}

function createDealCard(deal) {
    const card = document.createElement("article");
    card.className = "deal-card";
    card.innerHTML = `
        <div class="deal-card__image">${deal.image}</div>
        <div class="deal-card__body">
            <div class="deal-card__category">${getCategoryLabel(deal.category)}</div>
            <h3 class="deal-card__title">${deal.title}</h3>
            <p class="deal-card__description">${deal.description}</p>
            <div class="deal-card__price">
                ${deal.discount > 0 ? `<span class="deal-card__discount">-${deal.discount}%</span>` : ""}
                ${deal.originalPrice > 0 ? `<span class="deal-card__price-original">₩${deal.originalPrice.toLocaleString()}</span>` : ""}
                <span class="deal-card__price-current">₩${deal.price.toLocaleString()}</span>
            </div>
            <div class="deal-card__meta">
                <div class="deal-card__reactions">
                    <button class="reaction-btn like-btn ${deal.liked ? "active" : ""}" data-id="${deal.id}">
                        ${deal.liked ? "❤️" : "🤍"} <span class="like-count">${deal.likes}</span>
                    </button>
                    <button class="reaction-btn comment-btn" data-id="${deal.id}">
                        💬 <span class="comment-count">${deal.comments}</span>
                    </button>
                </div>
                <span class="deal-card__timestamp">${deal.timestamp}</span>
            </div>
        </div>
    `;

    // 이벤트 리스너 추가
    card.querySelector(".like-btn").addEventListener("click", toggleLike);
    card.querySelector(".comment-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        openDealModal(deal.id);
    });
    card.addEventListener("click", () => openDealModal(deal.id));

    return card;
}

function getCategoryLabel(category) {
    const labels = {
        grocery: "마켓",
        fashion: "패션",
        electronics: "전자",
        travel: "여행",
    };
    return labels[category] || "기타";
}

function renderPagination() {
    DOM.pagination.innerHTML = "";

    const totalPages = Math.ceil(app.filteredDeals.length / app.itemsPerPage);

    if (totalPages <= 1) return;

    // Previous Button
    const prevBtn = document.createElement("button");
    prevBtn.className = "pagination__btn";
    prevBtn.textContent = "← 이전";
    prevBtn.disabled = app.currentPage === 1;
    prevBtn.addEventListener("click", () => goToPage(app.currentPage - 1));
    DOM.pagination.appendChild(prevBtn);

    // Page Numbers
    const startPage = Math.max(1, app.currentPage - 2);
    const endPage = Math.min(totalPages, app.currentPage + 2);

    if (startPage > 1) {
        const firstBtn = createPageBtn(1);
        DOM.pagination.appendChild(firstBtn);

        if (startPage > 2) {
            const dots = document.createElement("span");
            dots.className = "pagination__dot";
            dots.textContent = "...";
            DOM.pagination.appendChild(dots);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = createPageBtn(i);
        DOM.pagination.appendChild(pageBtn);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dots = document.createElement("span");
            dots.className = "pagination__dot";
            dots.textContent = "...";
            DOM.pagination.appendChild(dots);
        }

        const lastBtn = createPageBtn(totalPages);
        DOM.pagination.appendChild(lastBtn);
    }

    // Next Button
    const nextBtn = document.createElement("button");
    nextBtn.className = "pagination__btn";
    nextBtn.textContent = "다음 →";
    nextBtn.disabled = app.currentPage === totalPages;
    nextBtn.addEventListener("click", () => goToPage(app.currentPage + 1));
    DOM.pagination.appendChild(nextBtn);
}

function createPageBtn(pageNum) {
    const btn = document.createElement("button");
    btn.className = "pagination__btn";
    if (pageNum === app.currentPage) btn.classList.add("active");
    btn.textContent = pageNum;
    btn.addEventListener("click", () => goToPage(pageNum));
    return btn;
}

function goToPage(pageNum) {
    app.currentPage = pageNum;
    renderDealList();
    renderPagination();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==========================================
// 9. Like/Unlike Functionality
// ==========================================

function toggleLike(e) {
    e.stopPropagation();
    const dealId = parseInt(e.currentTarget.dataset.id);
    const deal = app.allDeals.find((d) => d.id === dealId);

    if (deal) {
        deal.liked = !deal.liked;
        deal.likes += deal.liked ? 1 : -1;

        const likeBtn = e.currentTarget;
        likeBtn.classList.toggle("active");
        likeBtn.innerHTML = `${deal.liked ? "❤️" : "🤍"} <span class="like-count">${deal.likes}</span>`;
    }
}

// ==========================================
// 10. Modal Functions
// ==========================================

function openDealModal(dealId) {
    const deal = app.allDeals.find((d) => d.id === dealId);
    if (!deal) return;

    // 모달 콘텐츠 생성
    let commentsHTML = "";
    if (app.comments[dealId]) {
        commentsHTML = app.comments[dealId]
            .map(
                (comment) => `
            <div class="comment-item">
                <div class="comment-item__author">${comment.author}</div>
                <div class="comment-item__content">${comment.content}</div>
                <div class="comment-item__actions">
                    <span class="comment-item__action">${comment.timestamp}</span>
                    <span class="comment-item__action delete-comment" data-id="${dealId}">삭제</span>
                </div>
            </div>
        `
            )
            .join("");
    }

    DOM.dealDetail.innerHTML = `
        <div class="deal-detail__header">
            <h2 class="deal-detail__title">${deal.title}</h2>
        </div>

        <div class="deal-detail__image">${deal.image}</div>

        <div class="deal-detail__meta">
            <div class="deal-detail__info">
                <div class="deal-detail__info-label">정가</div>
                <div class="deal-detail__info-value">₩${deal.originalPrice.toLocaleString()}</div>
            </div>
            <div class="deal-detail__info">
                <div class="deal-detail__info-label">할인가</div>
                <div class="deal-detail__info-value" style="color: #FF6B35;">₩${deal.price.toLocaleString()}</div>
            </div>
            <div class="deal-detail__info">
                <div class="deal-detail__info-label">할인율</div>
                <div class="deal-detail__info-value">${deal.discount}%</div>
            </div>
            <div class="deal-detail__info">
                <div class="deal-detail__info-label">추천</div>
                <div class="deal-detail__info-value">${deal.likes}</div>
            </div>
        </div>

        <div class="deal-detail__description">
            <h3 style="margin-bottom: 10px;">상세 정보</h3>
            <p>${deal.description}</p>
        </div>

        <div class="deal-detail__actions">
            <button class="btn btn--primary" onclick="alert('외부 링크로 이동합니다.')">상품 보러가기</button>
            <button class="btn btn--secondary like-deal-btn">
                ${deal.liked ? "❤️ 추천 완료" : "🤍 추천하기"}
            </button>
        </div>

        <section class="comments-section">
            <h3 class="comments__title">댓글 (${app.comments[dealId]?.length || 0})</h3>

            <form class="comment-form" id="commentForm">
                <input
                    type="text"
                    class="comment-form__input"
                    id="commentAuthor"
                    placeholder="이름"
                    required>
                <input
                    type="text"
                    class="comment-form__input"
                    id="commentContent"
                    placeholder="댓글을 입력하세요"
                    style="flex: 2;"
                    required>
                <button type="submit" class="btn btn--primary comment-form__submit">등록</button>
            </form>

            <div class="comments-list">
                ${commentsHTML || '<p style="text-align: center; color: #999; padding: 30px;">댓글이 없습니다.</p>'}
            </div>
        </section>
    `;

    // 댓글 추가 이벤트
    document.getElementById("commentForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const author = document.getElementById("commentAuthor").value;
        const content = document.getElementById("commentContent").value;

        if (!app.comments[dealId]) {
            app.comments[dealId] = [];
        }

        app.comments[dealId].push({
            author,
            content,
            timestamp: "방금 전",
        });

        deal.comments += 1;

        // UI 업데이트
        openDealModal(dealId);
    });

    // 좋아요 버튼
    document.querySelector(".like-deal-btn").addEventListener("click", (e) => {
        e.preventDefault();
        toggleLike({ currentTarget: { dataset: { id: dealId }, stopPropagation: () => {} } });
        openDealModal(dealId);
    });

    // 삭제 버튼
    document.querySelectorAll(".delete-comment").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const idx = Array.from(document.querySelectorAll(".delete-comment")).indexOf(btn);
            if (app.comments[dealId]) {
                app.comments[dealId].splice(idx, 1);
                deal.comments = Math.max(0, deal.comments - 1);
                openDealModal(dealId);
            }
        });
    });

    // 모달 열기
    DOM.dealModal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    DOM.dealModal.classList.remove("active");
    document.body.style.overflow = "";
}

// ==========================================
// 11. Initialize App
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    initEventListeners();
    filterAndSort();
});

// Keyboard 지원 - ESC로 모달 닫기
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});
