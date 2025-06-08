// ebebek-carousel.js
(async () => {
    const PRODUCT_KEY = "carouselProducts";
    const FAVORITES_KEY = "carouselFavorites";

    if (!location.pathname.includes("index") && location.pathname !== "/") {
        console.log("wrong page");
        return;
    }


    // CSS styles
    const injectStyles = () => {
        const style = document.createElement("style");
        style.textContent = `
        /* Container */
        .carousel-container {
            position: relative;
            margin: 24px 0;
            padding: 16px 0;
            background: #FFFFFF;
        }

        /* Header */
        .carousel-container h2 {
            display: block;                            
            padding: 16px;                               
            
            
            background-color: #FFF8E8; /* i coulnt find the exact color */
            
            border-radius: 16px;                        
            color: #F57D20;                          
            font-size: 24px;
            font-weight: 700;
        }

        /* Wrapper */
        .carousel-wrapper {
            display: flex;
            overflow-x: auto;
            gap: 12px;
            padding: 0 16px;
        }

        /* Each card */
        .carousel-card {
            flex: 0 0 240px;
            background: #FFFFFF;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            display: flex;
            flex-direction: column;
            padding: 12px;
            position: relative;
        }

        /* Product image */
        .product-img {
            position: relative;
            width: 100%;
            padding-top: 100%;   
            overflow: hidden;
            border-radius: 8px;
        }
        .product-img img {
            position: absolute;
            top: 0; left: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        /* Fav heart icon*/
        .heart {
            position: absolute;
            top: 8px; right: 8px;
            width: 32px; height: 32px;
            background: #FFFFFF;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 1px 4px rgba(0,0,0,0.1);
            color: #CCCCCC;
            font-size: 16px;
            cursor: pointer;
        }
        .heart.liked {
            color: #F57D20;
        }

        /* product brand */
        .product-brand {
            font-size: 14px;
            font-weight: 600;
            color: #333333;
            margin-top: 8px;
        }
        .product-name {
            font-size: 13px;
            color: #666666;
            margin: 4px 0 8px;
            line-height: 1.4;
            flex-grow: 1;
        }

        /* Pricing */
        .price-container {
            display: flex;
            align-items: center;
            font-size: 14px;
            margin-bottom: 8px;
        }
        .old-price {
            text-decoration: line-through;
            color: #999999;
            margin-right: 6px;
        }
        .discount {
            background: #E0F2F1;
            color: #00796B;
            font-size: 12px;
            padding: 2px 6px;
            border-radius: 10px;
            margin-right: auto;
        }
        .price {
            font-size: 16px;
            font-weight: 600;
            color: #333333;
        }

        /* Add to card  */
        .sepete-ekle {
            background: #FFEAD0;
            color: #F57D20;
            border: none;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            padding: 8px 0;
            cursor: pointer;
            margin-top: auto;
        }
        .sepete-ekle:hover {
            background: #FDE5B5;
        }

        /* Arrow buttons */
        .carousel-arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 36px; height: 36px;
            background: #FFFFFF;
            border: none;
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            font-size: 18px;
            cursor: pointer;
            z-index: 10;
        }
        .carousel-arrow.left { left: 8px; }
        .carousel-arrow.right { right: 8px; }

        .carousel-inner {
            margin: 0 16px;                              
            background: rgba(245,125,32,0.1);             
            border-radius: 16px 16px 0 0;                 
            padding-top: 16px;                         
            padding-bottom: 24px;                         
        }

        .carousel-inner > h2 {
            margin: 0 0 12px;                            
            background: none;
            font-size: 24px;
            font-weight: 700;
            color: #F57D20;
        }

        `;
        document.head.appendChild(style);
        };


    // Favorites
    const toggleFavorite = (productId) => {
        const raw = localStorage.getItem(FAVORITES_KEY);
        const favorites = raw ? JSON.parse(raw) : [];

        const index = favorites.indexOf(productId);
        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(productId);
        }

        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        renderCarousel();
    };

    const isFavorite = (productId) => {
        const raw = localStorage.getItem(FAVORITES_KEY);
        const favorites = raw ? JSON.parse(raw) : [];
        return favorites.includes(productId);
    };


    // Fetch or get from localStorage
    const fetchProducts = async () => {
        return [
            { id: 1, brand: "HelloBaby", name: " Yenidoğan 6lı Ağız Mendili 24x24cm Unisex ", url: "https://www.e-bebek.com/hellobaby-yenidogan-6li-agiz-mendili-24x24cm-unisex-p-24ghlbumnd007001", img: "https://cdn05.e-bebek.com/mnresize/300/300/media/p/organik-6li-agiz-mendili-24x24-cm_8682766103779_01.jpg", price: 89.99, original_price: 89.99 },
            { id: 2, brand: "HelloBaby", name: "Unisex Beyaz Body Ribana Kumaş Çıtçıtlı Zıbın Zarf Yaka Kısa Kol", url: "https://www.e-bebek.com/hellobaby-unisex-beyaz-body-ribana-kumas-citcitli-zibin-zarf-yaka-kisa-kol-beyaz-p-24ghlbubdy010002", img: "https://cdn05.e-bebek.com/mnresize/300/300/media/p/a_8682766438970_01.jpg", price: 69.99, original_price: 69.99 },
            { id: 3, brand: "HelloBaby", name: "Unisex Beyaz Body Ribana Kumaş Çıtçıtlı Zıbın Bisiklet Yaka Atlet Kol", url: "https://www.e-bebek.com/hellobaby-unisex-beyaz-body-ribana-kumas-citcitli-zibin-bisiklet-yaka-atlet-kol-beyaz-p-24ghlbubdy002008", img: "https://cdn05.e-bebek.com/mnresize/300/300/media/p/abcdeefff_8682766439298_01.jpg", price: 69.99, original_price: 69.99 },
            {id : 4, brand: "HelloBaby", name : "Yenidoğan Müslin Ağız Mendili Unisex", url: "https://www.e-bebek.com/hellobaby-yenidogan-muslin-agiz-mendili-unisex-p-24ghlbumnd003003",img : "https://cdn05.e-bebek.com/mnresize/300/300/media/p/yenidogan-muslin-agiz-mendili-unisex_8682766728736_01.jpg", price : 89.99, original_price : 89.99},
            {id : 5, brand: "Aziz Bebe", name : "Yenidoğan Süzene Nakışlı 5li Askı Hastane Çıkışı", url: "https://www.e-bebek.com/aziz-bebe-yenidogan-suzene-nakisli-5li-aski-hastane-cikisi-p-24yazzeset001001",img : "https://cdn05.e-bebek.com/mnresize/300/300/media/p/24y-little-life-yenidogan-suzene-nakisli-5li-aski-hastane-cikisi-erkek-bebek_8682766693195_01.jpg", price : 399.99, original_price : 479.99},
            {id : 6, brand: "HelloBaby", name : "Kız Bebek Sweatshirt Şardonlu Çiçek Desenli Bisiklet Yaka Uzun Kol", url: "https://www.e-bebek.com/hellobaby-kiz-bebek-sweatshirt-sardonlu-cicek-desenli-bisiklet-yaka-uzun-kol-desenli-p-24khlbkswt008004",img : "https://cdn05.e-bebek.com/mnresize/300/300/media/p/basic-az-sardonlu-cicek-desenli-sweatshirt-kiz-bebek_8682766731644_01.jpg", price : 99.99, original_price : 199.99},
            {id : 7, brand: "HelloBaby", name : "Unisex Beyaz Body Ribana Kumaş Çıtçıtlı Zıbın Bisiket Yaka İp Askılı", url: "https://www.e-bebek.com/hellobaby-unisex-beyaz-body-ribana-kumas-citcitli-zibin-bisiket-yaka-ip-askili-beyaz-p-24ghlbubdy009008",img : "", price : 69.99, original_price : 69.99},
            {id : 8, brand: "Little Dreams", name : "Kız Müslin Battaniye Bebek", url: "https://www.e-bebek.com/little-dreams-kiz-muslin-battaniye-kiz-bebek-p-24kltlkmsl002001",img : "https://cdn05.e-bebek.com/mnresize/300/300/media/p/kiz-muslin-battaniye-kiz-bebek_8682766812732_01.jpg", price : 269.99, original_price : 169.99}
        ];
    };

    const getProducts = async () => {
        let productsRaw = localStorage.getItem(PRODUCT_KEY);
        let products = productsRaw ? JSON.parse(productsRaw) : null;

        if (!products) {
            products = await fetchProducts();
            localStorage.setItem(PRODUCT_KEY, JSON.stringify(products));
        }
        return products;
    };

    // Render
    const renderCarousel = async () => {
        const products = await getProducts();
        const existing = document.querySelector(".carousel-container");
        if (existing) existing.remove();

        const container = document.createElement("div");
        container.className = "carousel-container";

        const inner = document.createElement("div");
        inner.className = "carousel-inner";

        const wrapper = document.createElement("div");
        wrapper.className = "carousel-wrapper";



        const leftBtn = document.createElement('button');
        leftBtn.className = 'carousel-arrow left';
        leftBtn.innerHTML = '&#8249;';  // ‹
        leftBtn.addEventListener('click', () => {
            wrapper.scrollBy({ left: -300, behavior: 'smooth' });
        });
        const rightBtn = document.createElement('button');
        rightBtn.className = 'carousel-arrow right';
        rightBtn.innerHTML = '&#8250;'; // ›
        rightBtn.addEventListener('click', () => {
            wrapper.scrollBy({ left: 300, behavior: 'smooth' });
        });

        container.appendChild(leftBtn);
        container.appendChild(rightBtn);

        const title = document.createElement("h2");
        title.textContent = "Beğenebileceğinizi düşündüklerimiz";
        //container.appendChild(title);
        inner.appendChild(title);


        products.forEach(product => {
            const card = document.createElement("div");
            card.className = "carousel-card";

            card.innerHTML = `
                <div class="product-img">
                    <img src="${product.img}" alt="${product.name}" />
                    <div class="heart ${isFavorite(product.id) ? 'liked' : ''}">&#x2764;</div>
                </div>
                <a href="${product.url}" target="_blank">
                    <div class="product-brand">${product.brand}</div>
                    <div class="product-name">${product.name}</div>
                </a>
                <div class="price-container">
                    ${product.price !== product.original_price ? `<span class="old-price">${product.original_price.toFixed(2)} TL</span><span class="discount">${(100 - (product.price * 100 / product.original_price)).toFixed(0)}% \u0130ndirim</span>` : ''}
                    <div class="price">${product.price.toFixed(2)} TL</div>
                </div>
                <button class="sepete-ekle">Sepete Ekle</button>
            `;

            const heart = card.querySelector(".heart");
            if (heart) {
                heart.addEventListener("click", (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    toggleFavorite(product.id);
                });
            }


            wrapper.appendChild(card);
        });


        inner.appendChild(wrapper);
        container.appendChild(inner);


        function placeCarousel() {
            const thumbCarousel = document.querySelector('.banner__campaign .owl-carousel');
            if (!thumbCarousel) return false;
            thumbCarousel.insertAdjacentElement('afterend', container);
            return true;
        }


        const waiter = setInterval(() => {
            if (placeCarousel()) clearInterval(waiter);
        }, 150);


    };

    //Start
    injectStyles();
    renderCarousel();
})();
