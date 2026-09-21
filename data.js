/* Lantees Cafe & Bistro. All site content lives here so the owner can edit
   copy, prices and settings without touching the pages.
   Prices are in naira and exclude the 5% service charge and 7.5% VAT. */

window.LANTEES = {
  brand: {
    name: "Lantees Cafe & Bistro",
    short: "Lantees",
    tagline: "A space of warmth and nature-inspired flavours",
    phone: "+2348039994446",
    phoneDisplay: "+234 803 999 4446",
    whatsapp: "2348039994446",
    email: "Lanteescafe@gmail.com",
    instagram: "lanteescafe",
    address: {
      line1: "Sarius Palmetum",
      line2: "3259 Ibrahim Babangida Boulevard (IBB Way)",
      area: "Maitama, Abuja 904101",
      country: "Nigeria"
    },
    geo: { lat: 9.1017855, lng: 7.4887182 },
    mapsUrl: "https://maps.app.goo.gl/vRewKNS1jVjpqsbm6",
    appleMapsUrl: "https://maps.apple.com/?ll=9.1017855,7.4887182&q=Lantees%20Cafe",
    /* Africa/Lagos, 24h. Day index 0 = Sunday. */
    hours: [
      { d: 0, open: "11:00", close: "22:00" },
      { d: 1, open: "08:00", close: "22:00" },
      { d: 2, open: "08:00", close: "22:00" },
      { d: 3, open: "08:00", close: "22:00" },
      { d: 4, open: "08:00", close: "22:00" },
      { d: 5, open: "08:00", close: "22:00" },
      { d: 6, open: "08:00", close: "22:00" }
    ],
    /* Card payments switch on when the owner pastes a Paystack public key. */
    paystackKey: "",
    deliveryPartners: [
      { name: "Glovo", url: "https://glovoapp.com/ng/en/abuja/" },
      { name: "Chowdeck", url: "https://chowdeck.com/" }
    ]
  },

  charges: { service: 0.05, vat: 0.075 },

  order: {
    prepMinutes: 30,
    lastOrderMinutesBeforeClose: 45,
    /* Delivery areas and fees. Estimates until confirmed by the cafe. */
    zones: [
      { id: "maitama", name: "Maitama", fee: 2500 },
      { id: "katampe", name: "Katampe", fee: 3500 },
      { id: "wuse2", name: "Wuse 2", fee: 3500 },
      { id: "asokoro", name: "Asokoro", fee: 3500 },
      { id: "mabushi", name: "Mabushi", fee: 4000 },
      { id: "wuse", name: "Wuse", fee: 4500 },
      { id: "jabi", name: "Jabi", fee: 4500 },
      { id: "jahi", name: "Jahi", fee: 4500 },
      { id: "utako", name: "Utako", fee: 4500 },
      { id: "guzape", name: "Guzape", fee: 4500 },
      { id: "garki", name: "Garki", fee: 5000 },
      { id: "kado", name: "Kado", fee: 5000 },
      { id: "lifecamp", name: "Life Camp", fee: 5500 },
      { id: "gwarinpa", name: "Gwarinpa", fee: 6000 },
      { id: "apo", name: "Apo", fee: 6000 },
      { id: "lokogoma", name: "Lokogoma", fee: 7000 }
    ]
  },

  rooms: [
    {
      id: "terrace",
      name: "The Garden Terrace",
      copy: "Tables under the palms of Sarius Palmetum, stone walls and parasols. Breakfast in the sun, long lunches in the shade.",
      img: "space-garden-terrace",
      seats: "Up to 30 guests"
    },
    {
      id: "salon",
      name: "The Salon",
      copy: "Terracotta plaster, green leather banquettes and marble tables beneath the lit script. The room for celebrations and slow dinners.",
      img: "space-salon-wide",
      seats: "Up to 40 guests"
    },
    {
      id: "window",
      name: "The Window Bar",
      copy: "A counter facing the gardens. Laptops on weekday mornings, an espresso between meetings, a quiet seat for one.",
      img: "space-window-women",
      seats: "8 seats"
    },
    {
      id: "bar",
      name: "The Coffee Bar",
      copy: "Green tile, brass pendants and the baristas. Specialty coffee, signature drinks and cakes under glass.",
      img: "space-bar-baristas",
      seats: "Counter service"
    }
  ],

  /* Menu sections. c = contains, diet = veg | vegan. opts = choices that
     change the dish; a choice with a price adds to the line. */
  menu: [
    {
      id: "breakfast",
      name: "Breakfast",
      lede: "Poached eggs and pancakes beside kosai and fonio. Served all day.",
      img: "food-big-breakfast",
      items: [
        {
          id: "big-breakfast", name: "Lantees Big Breakfast", price: 20500, img: "food-big-breakfast",
          desc: "Chicken or lamb sausages, tomatoes, cucumber, potatoes, scrambled eggs, ciabatta or multi-cereal sourdough.",
          c: ["gluten", "eggs", "dairy"],
          opts: [
            { id: "sausage", name: "Sausages", type: "single", choices: [{ n: "Chicken" }, { n: "Lamb" }] },
            { id: "bread", name: "Bread", type: "single", choices: [{ n: "Ciabatta" }, { n: "Multi-cereal sourdough" }] }
          ]
        },
        {
          id: "kosai", name: "Kosai", price: 15500,
          desc: "Traditional Nigerian bean-cake waffle topped with smoked mackerel, served with tamarind millet gruel (kunun tsamiya).",
          c: ["gluten", "fish"]
        },
        {
          id: "benedict", name: "Benedict", price: 20900, img: "food-benedict",
          desc: "Poached eggs, English muffin, smoked salmon, hollandaise.",
          c: ["gluten", "dairy", "eggs", "fish"]
        },
        {
          id: "avocado-toast", name: "Avocado Toast", price: 17500, img: "food-avocado-top", diet: "veg",
          desc: "Poached eggs, ciabatta or multi-cereal sourdough, avocado, tomatoes, mixed greens. Hot sauce on request.",
          c: ["gluten", "eggs"],
          opts: [
            { id: "bread", name: "Bread", type: "single", choices: [{ n: "Ciabatta" }, { n: "Multi-cereal sourdough" }] },
            { id: "extras", name: "Extras", type: "multi", choices: [{ n: "Add smoked salmon", p: 8000 }, { n: "Hot sauce" }] }
          ]
        },
        {
          id: "pancakes", name: "Buttermilk Pancakes", price: 16500, img: "food-pancakes-stack", diet: "veg",
          desc: "Homemade lemon curd or maple syrup, Chantilly cream.",
          c: ["gluten", "dairy", "eggs"],
          opts: [{ id: "topping", name: "Topping", type: "single", choices: [{ n: "Homemade lemon curd" }, { n: "Maple syrup" }] }]
        },
        {
          id: "french-toast", name: "French Toast", price: 14500, diet: "veg",
          desc: "Homemade bread, blueberry compote, whipped cream, seasonal fruits.",
          c: ["gluten", "dairy", "eggs"]
        },
        {
          id: "cereal-bowl", name: "Fonio Cereal Bowl", price: 14500, img: "food-porridge", diet: "veg",
          desc: "Fonio, blueberry compote, caramelised banana, toasted cashew.",
          c: ["nuts"]
        },
        {
          id: "granola", name: "Granola", price: 15500, img: "food-granola-bowl", diet: "veg",
          desc: "Greek-style yoghurt, nutty granola, seasonal fruits.",
          c: ["dairy", "nuts"]
        }
      ]
    },
    {
      id: "begin",
      name: "To Begin",
      lede: "Small plates for the table.",
      items: [
        { id: "chimichurri-potatoes", name: "Roasted Chimichurri Potatoes", price: 7500, diet: "veg", desc: "Minted labneh, potatoes.", c: ["dairy"] },
        { id: "meatballs", name: "Tzatziki and Spiced Meatballs", price: 9500, desc: "Lamb meatballs, Greek yoghurt, cucumber, served on flatbread.", c: ["gluten", "dairy"] }
      ]
    },
    {
      id: "salads",
      name: "Salads",
      lede: "Quinoa, kale and citrus from the garden side of the kitchen.",
      img: "food-salmon-salad",
      items: [
        {
          id: "salmon-salad", name: "Salmon, Kale and Quinoa Salad", price: 26500, img: "food-salmon-close",
          desc: "Tricolour quinoa, pan-seared salmon, raisins, pomegranate, honey mustard dressing. Toasted cashews on request.",
          c: ["fish", "gluten", "nuts"],
          opts: [{ id: "cashew", name: "Toasted cashews", type: "single", choices: [{ n: "With cashews" }, { n: "Without cashews" }] }]
        },
        {
          id: "prawn-salad", name: "Lemongrass Chilli Prawn Salad", price: 24500,
          desc: "Grilled prawns, mixed greens, cucumber, radish, apples, vinaigrette.",
          c: ["shellfish"]
        },
        {
          id: "garden-salad", name: "Lantees Garden Salad", price: 15500, diet: "vegan",
          desc: "Sweet potatoes, chickpeas, mixed greens, cherry tomatoes over creamy hummus.",
          opts: [{ id: "bread", name: "Extras", type: "multi", choices: [{ n: "Add flatbread", p: 2000 }] }]
        }
      ]
    },
    {
      id: "savour",
      name: "To Savour",
      lede: "The plates guests come back for.",
      img: "food-chicken-waffles-pour",
      items: [
        {
          id: "chicken-skewers", name: "Grilled Chicken Skewers", price: 19500, img: "food-table-spread-2",
          desc: "Lemongrass chicken, red cabbage, pickled onions, lemon mayo, hot sauce. With fries or house-style mash.",
          c: ["gluten", "dairy", "eggs"],
          opts: [{ id: "side", name: "Side", type: "single", choices: [{ n: "Fries" }, { n: "House-style mash" }] }]
        },
        {
          id: "chicken-waffles", name: "Hot Honey Fried Chicken Waffles", price: 18500, img: "food-chicken-waffles-pour",
          desc: "Savoury waffles, crispy fried chicken, hot sauce with lemon mayo or maple syrup.",
          c: ["gluten", "dairy", "eggs"],
          opts: [{ id: "sauce", name: "Finish", type: "single", choices: [{ n: "Hot sauce and lemon mayo" }, { n: "Maple syrup" }] }]
        }
      ]
    },
    {
      id: "pasta",
      name: "Pasta",
      lede: "Handmade gnocchi, house pesto and a ragu finished with wara.",
      img: "food-gnocchi",
      items: [
        {
          id: "gnocchi", name: "Gnocchi Rosso", price: 15800, img: "food-gnocchi", diet: "veg",
          desc: "Homemade gnocchi, roasted pepper cashew cream, pangritata.",
          c: ["gluten", "dairy", "nuts"],
          opts: [{ id: "protein", name: "Extras", type: "multi", choices: [{ n: "Add chicken", p: 6000 }] }]
        },
        {
          id: "penne-pesto", name: "Penne Pesto", price: 16500, img: "food-pesto-fork", diet: "veg",
          desc: "Penne, homemade pesto, cream.",
          c: ["gluten", "dairy"],
          opts: [{ id: "protein", name: "Extras", type: "multi", choices: [{ n: "Add beef", p: 5000 }] }]
        },
        {
          id: "linguine-ragu", name: "Linguine Ragu", price: 22500, img: "food-linguine",
          desc: "Linguine in fresh tomato sauce, smoked beef, topped with wara (milk curd). Chilli oil on request.",
          c: ["gluten", "dairy"],
          opts: [{ id: "chilli", name: "Chilli oil", type: "single", choices: [{ n: "Without" }, { n: "With chilli oil" }] }]
        },
        {
          id: "aglio", name: "Aglio e Olio", price: 15500, diet: "vegan",
          desc: "Spaghetti, olive oil, garlic, parsley.",
          c: ["gluten"],
          opts: [{ id: "protein", name: "Extras", type: "multi", choices: [{ n: "Add prawns", p: 7000 }] }]
        }
      ]
    },
    {
      id: "sandwiches",
      name: "Sandwiches and Grill",
      lede: "Ribeye, focaccia and the house burger. Fries and greens on the side.",
      img: "food-burger",
      items: [
        {
          id: "steak-poivre", name: "Steak au Poivre", price: 22500, img: "food-steak-overhead",
          desc: "Ribeye, sautéed mushrooms, peppercorn sauce. With fries or house-style mash and mixed greens.",
          c: ["gluten", "dairy"],
          opts: [{ id: "side", name: "Side", type: "single", choices: [{ n: "Fries" }, { n: "House-style mash" }] }]
        },
        {
          id: "steak-sandwich", name: "Steak au Poivre Sandwich", price: 19900, img: "food-sandwich-flatlay",
          desc: "Ribeye, mushrooms and peppercorn sauce on ciabatta. Fries, mixed greens.",
          c: ["gluten", "dairy"]
        },
        {
          id: "club", name: "House Club Sandwich", price: 17500, img: "food-flatlay-coffee",
          desc: "Homemade focaccia, grilled chicken, lettuce, eggs, tomatoes. Fries, mixed greens.",
          c: ["gluten", "eggs"]
        },
        {
          id: "burger", name: "Lantees Burger", price: 18500, img: "food-burger",
          desc: "Homemade bun, beef patty, cheese, pickles, caramelised onions, house special sauce. Fries, mixed greens.",
          c: ["gluten", "dairy"]
        }
      ]
    },
    {
      id: "pizza",
      name: "From the Pizza Oven",
      lede: "Every pizza comes on a regular or charcoal-infused crust.",
      img: "food-charcoal-pizza",
      shared: [{ id: "crust", name: "Crust", type: "single", choices: [{ n: "Regular" }, { n: "Charcoal-infused" }] }],
      items: [
        { id: "pizza-chicken", name: "Chicken Special", price: 17500, img: "food-pizza-swirl", desc: "House tomato sauce, chicken, peppers, onions, mozzarella, house hot sauce.", c: ["gluten", "dairy"] },
        { id: "pizza-wagyu", name: "African Wagyu", price: 15500, img: "food-pizza-close", desc: "House tomato sauce, smoked beef, peppers, onions, mozzarella, house hot sauce.", c: ["gluten", "dairy"] },
        { id: "pizza-margherita", name: "Margherita", price: 14500, img: "food-spread-green", diet: "veg", desc: "House tomato sauce, mozzarella, parmesan.", c: ["gluten", "dairy"] },
        { id: "pizza-marinara", name: "Marinara", price: 21500, desc: "House tomato sauce, prawns, calamari, peppers, onions, mozzarella.", c: ["gluten", "dairy", "shellfish"] }
      ]
    },
    {
      id: "roast",
      name: "Sunday Roast",
      lede: "Sundays from eleven. Each roast comes with seasonal vegetables and your choice of roast potatoes, mashed potatoes, saffron rice or saffron couscous.",
      img: "food-lamb-rack",
      sunday: true,
      shared: [{ id: "side", name: "Served with", type: "single", choices: [{ n: "Roast potatoes" }, { n: "Mashed potatoes" }, { n: "Saffron rice" }, { n: "Saffron couscous" }] }],
      items: [
        { id: "roast-tbone", name: "Chargrilled T-Bone Maison", price: 51500, img: "food-tbone", desc: "" },
        { id: "roast-lamb-chops", name: "Classic Grilled Lamb Chops", price: 58500, img: "food-lamb-rack", desc: "With gravy." },
        { id: "roast-lamb-shank", name: "Signature Slow-Braised Lamb Shank", price: 65000, img: "food-lamb-shank", desc: "The house roast." },
        { id: "roast-chicken", name: "Herb Confit Baby Chicken", price: 45500, img: "food-roast-chicken", desc: "With gravy." },
        { id: "roast-sea-bream", name: "Mediterranean Sea Bream", price: 38500, img: "food-grilled-fish", desc: "With tomatoes, olives and capers.", c: ["fish"] },
        { id: "roast-prawns", name: "Flame-Grilled Prawns", price: 39500, img: "food-prawns-rice", desc: "", c: ["shellfish"] }
      ]
    },
    {
      id: "sides",
      name: "Sides",
      compact: true,
      items: [
        { id: "side-fries", name: "Fries", price: 5000, diet: "vegan" },
        { id: "side-eggs", name: "Eggs", price: 4000, diet: "veg", c: ["eggs"] },
        { id: "side-avocado", name: "Avocado", price: 3000, diet: "vegan" },
        { id: "side-sausages", name: "Sausages", price: 5000 },
        { id: "side-prawns", name: "Prawns", price: 7000, c: ["shellfish"] },
        { id: "side-mash", name: "House-Style Mash", price: 6000, diet: "veg", c: ["dairy"] },
        { id: "side-sweet-mash", name: "Sweet Potato Mash", price: 5000, diet: "veg", c: ["dairy"] }
      ]
    },
    {
      id: "coffee",
      name: "Coffee",
      lede: "Iced and decaffeinated on request. Cashew, oat or soy milk for ₦3,000.",
      img: "drink-matcha",
      shared: [
        { id: "temp", name: "Serve", type: "single", choices: [{ n: "Hot" }, { n: "Iced" }] },
        { id: "milk", name: "Milk", type: "single", choices: [{ n: "Full fat" }, { n: "Cashew", p: 3000 }, { n: "Oat", p: 3000 }, { n: "Soy", p: 3000 }] },
        { id: "decaf", name: "Beans", type: "single", choices: [{ n: "Regular" }, { n: "Decaffeinated" }] }
      ],
      compact: true,
      items: [
        { id: "espresso", name: "Espresso", price: 4500, diet: "vegan", noMilk: true },
        { id: "double-espresso", name: "Double Espresso", price: 5500, diet: "vegan", noMilk: true },
        { id: "americano", name: "Americano", price: 5000, diet: "vegan", noMilk: true },
        { id: "macchiato", name: "Macchiato", price: 6500, diet: "veg", c: ["dairy"] },
        { id: "cappuccino", name: "Cappuccino", price: 6500, diet: "veg", c: ["dairy"] },
        { id: "flat-white", name: "Flat White", price: 7500, diet: "veg", c: ["dairy"] },
        { id: "mocha", name: "Mocha", price: 7500, diet: "veg", c: ["dairy"] },
        { id: "latte", name: "Latte", price: 8500, diet: "veg", c: ["dairy"] },
        { id: "caramel-latte", name: "Caramel Latte", price: 9500, diet: "veg", c: ["dairy"] },
        {
          id: "matcha-latte", name: "Matcha Latte", price: 10500, diet: "veg", c: ["dairy"], img: "drink-matcha",
          opts: [{ id: "flavour", name: "Flavour", type: "single", choices: [{ n: "Classic" }, { n: "Vanilla" }, { n: "Strawberry" }] }]
        },
        { id: "frappuccino", name: "Frappuccino", price: 11500, diet: "veg", c: ["dairy"], desc: "Espresso, milk, ice cream, flavoured syrup, whipped cream." }
      ]
    },
    {
      id: "tea",
      name: "Tea and Warm Drinks",
      img: "drink-tea-pour",
      compact: true,
      items: [
        { id: "english-breakfast", name: "English Breakfast", price: 4000, diet: "vegan" },
        { id: "earl-grey", name: "Earl Grey", price: 4000, diet: "vegan" },
        { id: "green-tea", name: "Green Tea", price: 4000, diet: "vegan" },
        { id: "fresh-mint", name: "Fresh Mint", price: 4000, diet: "vegan" },
        { id: "lemon-ginger", name: "Lemon, Ginger and Lemongrass", price: 7500, diet: "vegan" },
        { id: "hot-chocolate", name: "Hot Chocolate", price: 8500, diet: "veg", c: ["dairy"] },
        { id: "moringa-latte", name: "Moringa Latte", price: 8500, diet: "veg", c: ["dairy"] },
        { id: "chai-latte", name: "Chai Latte", price: 9500, diet: "veg", c: ["dairy"] },
        { id: "mamas-brew", name: "Mama's Brew", price: 10500, desc: "The house specialty blend." }
      ]
    },
    {
      id: "signature",
      name: "Signature Drinks",
      lede: "Eleven house creations, ₦13,500 each.",
      img: "drink-rose",
      compact: true,
      items: [
        { id: "sig-blueberry-fizz", name: "Blueberry Fizz", price: 13500 },
        { id: "sig-groovy-mango", name: "Groovy Mango", price: 13500 },
        { id: "sig-lantees-angel", name: "Lantees Angel", price: 13500 },
        { id: "sig-ginger-mint", name: "Ginger Mint Land", price: 13500 },
        { id: "sig-tropical-turmeric", name: "Tropical Turmeric", price: 13500 },
        { id: "sig-golden-spiced", name: "Golden Spiced Cooler", price: 13500 },
        { id: "sig-star-apple", name: "Star Apple Refresher", price: 13500, desc: "Agbalumo." },
        { id: "sig-mango-chia", name: "Mango Coconut Chia", price: 13500 },
        { id: "sig-botanical", name: "Botanical Garden", price: 13500 },
        { id: "sig-pure-passion", name: "Pure Passion", price: 13500 },
        { id: "sig-karak", name: "Karak Tea", price: 13500 }
      ]
    },
    {
      id: "juices",
      name: "Juices and Refreshers",
      lede: "Pressed to order. Baobab, tamarind, moringa and tigernut beside the classics.",
      img: "drink-green-mango",
      compact: true,
      items: [
        { id: "orange-juice", name: "Fresh Orange Juice", price: 6000, diet: "vegan" },
        { id: "pineapple-juice", name: "Fresh Pineapple Juice", price: 9500, diet: "vegan" },
        { id: "african-summer-rose", name: "African Summer Rose", price: 9500, diet: "vegan", desc: "Strawberries, hibiscus, rose." },
        { id: "lantees-refined", name: "Lantees Refined", price: 9500, diet: "vegan", desc: "Lemon, mint, lemongrass." },
        { id: "apple-power", name: "Apple Power", price: 9500, diet: "vegan", desc: "Pineapple, apple, mint." },
        { id: "cinna-nest", name: "Cinna Nest", price: 9500, diet: "vegan", desc: "Cinnamon, pineapple, ginger." },
        { id: "moringa-breeze", name: "Moringa Breeze", price: 10500, diet: "vegan", desc: "Moringa, cucumber, apple." },
        { id: "fresh", name: "Fresh", price: 8500, diet: "vegan", desc: "Watermelon, pineapple, mint." },
        { id: "glow", name: "Glow", price: 9500, diet: "vegan", desc: "Carrot, apple, orange." },
        { id: "lucky-beet", name: "Lucky Beet", price: 9500, diet: "vegan", desc: "Beetroot, apple, ginger." },
        { id: "tropic-baobab", name: "Tropic Baobab", price: 9500, diet: "vegan", desc: "Mango, baobab, pineapple." },
        { id: "tama-tide", name: "Tama Tide", price: 9500, diet: "vegan", desc: "Tamarind, pineapple, ginger." },
        { id: "aya-lait", name: "Aya Lait", price: 8500, diet: "vegan", desc: "Tigernut, dates, ginger." },
        { id: "virgin-mojito", name: "Virgin Mojito", price: 8500, diet: "vegan", desc: "Lime, soda, syrup." },
        { id: "chapman", name: "Chapman", price: 7500, diet: "vegan", desc: "Orange, lemon, grenadine." },
        { id: "orange-espresso", name: "Orange Espresso", price: 8500, diet: "vegan", desc: "Orange juice, espresso." },
        {
          id: "milkshake", name: "Milkshake", price: 11500, diet: "veg", c: ["dairy"],
          opts: [{ id: "flavour", name: "Flavour", type: "single", choices: [{ n: "Vanilla" }, { n: "Oreo" }, { n: "Strawberry" }] }]
        },
        { id: "seasonal-special", name: "Seasonal Special", price: 12500, diet: "vegan", c: ["nuts"], desc: "Strawberries, banana, cashew milk." },
        { id: "sparkling-water", name: "Sparkling Water", price: 7500, diet: "vegan" },
        { id: "tonic-water", name: "Tonic Water", price: 2500, diet: "vegan" },
        { id: "still-water", name: "Still Water", price: 2000, diet: "vegan" }
      ]
    },
    {
      id: "smoothies",
      name: "Smoothie Bar",
      lede: "Build your own: a base, two fruits, then the extras.",
      img: "drink-two-smoothies",
      items: [
        {
          id: "smoothie", name: "Build Your Own Smoothie", price: 12500, img: "drink-two-smoothies", diet: "veg",
          desc: "Choose a base and two fruits. Add more fruit or healthy extras for ₦500 each, and an immunity shot for ₦1,500.",
          opts: [
            { id: "base", name: "Base", type: "single", choices: [{ n: "Greek yoghurt" }, { n: "Whole milk" }, { n: "Oat milk" }, { n: "Soy milk" }, { n: "Coconut milk" }, { n: "Cashew milk" }, { n: "Orange juice" }] },
            { id: "fruit", name: "Fruits (two included)", type: "multi", min: 2, freeCount: 2, extraPrice: 500, choices: [{ n: "Banana" }, { n: "Apple" }, { n: "Strawberry" }, { n: "Cucumber" }, { n: "Pineapple" }, { n: "Avocado" }, { n: "Mango" }, { n: "Blueberries" }] },
            { id: "extras", name: "Healthy extras", type: "multi", choices: [{ n: "Oats", p: 500 }, { n: "Cashew", p: 500 }, { n: "Almond", p: 500 }, { n: "Chia seeds", p: 500 }, { n: "Pumpkin seeds", p: 500 }, { n: "Flax seeds", p: 500 }] },
            { id: "shot", name: "Immunity shot", type: "single", choices: [{ n: "None" }, { n: "Moringa, baobab, turmeric, ginger, hibiscus and honey", p: 1500 }] }
          ]
        }
      ]
    },
    {
      id: "shots",
      name: "Detox Shots",
      compact: true,
      items: [
        { id: "shot-turmeric", name: "Turmeric", price: 5500, diet: "vegan", desc: "Ginger, turmeric, lemon." },
        { id: "shot-ginger-power", name: "Ginger Power", price: 5500, diet: "vegan", desc: "Ginger, apple." },
        { id: "shot-suicide", name: "Suicide", price: 6500, diet: "vegan", desc: "100% ginger." },
        { id: "shot-detoxifier", name: "Detoxifier", price: 5500, diet: "vegan", desc: "Lemon, ginger, pepper." }
      ]
    }
  ],

  /* Home page: the dishes in the horizontal rail. */
  featured: ["chicken-waffles", "benedict", "salmon-salad", "gnocchi", "pizza-chicken", "roast-lamb-shank", "pancakes", "burger", "matcha-latte", "smoothie"],

  /* Gallery. Group: food | space | company. */
  gallery: [
    { img: "space-sign-brunch", g: "space", alt: "Brunch spread beneath the lit Lantees script" },
    { img: "guest-gentleman-kaftan", g: "company", alt: "A guest in a cream kaftan taking tea by the window" },
    { img: "food-pancakes-lemon", g: "food", alt: "Buttermilk pancakes with lemon curd and petals" },
    { img: "space-garden-terrace", g: "space", alt: "The garden terrace under parasols" },
    { img: "social-trio-sign", g: "company", alt: "Three friends on the banquette beneath the sign" },
    { img: "food-salmon-salad", g: "food", alt: "Salmon, kale and quinoa salad" },
    { img: "space-window-women", g: "space", alt: "The window bar looking onto the palms" },
    { img: "guest-floral", g: "company", alt: "A guest in a floral jacket at lunch" },
    { img: "food-lamb-rack", g: "food", alt: "Grilled lamb chops with mash and broccoli" },
    { img: "drink-rose", g: "food", alt: "African Summer Rose" },
    { img: "space-salon-wide", g: "space", alt: "The salon: terracotta walls, green leather, marble tables" },
    { img: "guest-gentleman-navy", g: "company", alt: "A guest in navy with amber glasses at lunch" },
    { img: "food-pizza-swirl", g: "food", alt: "Chicken special pizza with house hot sauce" },
    { img: "work-window-couple", g: "company", alt: "Two guests working at the window bar" },
    { img: "food-benedict", g: "food", alt: "Eggs Benedict with smoked salmon" },
    { img: "space-bar-baristas", g: "space", alt: "The coffee bar with green tile and pendant lights" },
    { img: "guest-pink-stripe", g: "company", alt: "A guest on the banquette" },
    { img: "food-brunch-flatlay", g: "food", alt: "A brunch flat lay" },
    { img: "drink-matcha", g: "food", alt: "Matcha latte" },
    { img: "social-garden-women", g: "company", alt: "Lunch on the garden terrace" },
    { img: "food-gnocchi", g: "food", alt: "Gnocchi rosso" },
    { img: "space-window-interior", g: "space", alt: "The window bar and pendant lights" },
    { img: "guest-purple-kaftan", g: "company", alt: "A guest at lunch by the coffee bar" },
    { img: "food-tbone", g: "food", alt: "Chargrilled T-bone with mash" },
    { img: "food-chicken-waffles-pour", g: "food", alt: "Hot honey fried chicken waffles" },
    { img: "space-sign-leaves", g: "space", alt: "The Lantees sign through banana leaves" },
    { img: "guest-yellow-2", g: "company", alt: "A guest in yellow at the window" },
    { img: "food-charcoal-pizza", g: "food", alt: "Charcoal-crust pizza" },
    { img: "drink-two-smoothies", g: "food", alt: "Two smoothies" },
    { img: "social-pizza-share", g: "company", alt: "Pizzas shared across the table" },
    { img: "food-lamb-shank", g: "food", alt: "Slow-braised lamb shank" },
    { img: "space-salon-chairs", g: "space", alt: "The salon by day" },
    { img: "guest-terrace-cap", g: "company", alt: "Coffee on the terrace" },
    { img: "food-avocado-top", g: "food", alt: "Avocado toast" },
    { img: "drink-green-hand", g: "food", alt: "Moringa Breeze" },
    { img: "guest-white-banquette", g: "company", alt: "A guest in white beneath the sign" },
    { img: "food-linguine", g: "food", alt: "Linguine ragu" },
    { img: "food-cake-cloche", g: "food", alt: "Cakes under glass at the counter" },
    { img: "guest-navy-tee", g: "company", alt: "A guest at the marble table" },
    { img: "food-steak-overhead", g: "food", alt: "Steak platter" },
    { img: "food-granola-bowl", g: "food", alt: "Granola with Greek yoghurt and berries" },
    { img: "social-two-women-sign", g: "company", alt: "Two friends beneath the sign" },
    { img: "food-porridge", g: "food", alt: "Fonio cereal bowl" },
    { img: "drink-iced-duo", g: "food", alt: "Iced coffee and iced matcha" },
    { img: "guest-plaid", g: "company", alt: "A guest at the coffee bar" },
    { img: "food-croissant-latte", g: "food", alt: "Croissants and a latte" },
    { img: "food-table-overhead", g: "food", alt: "Sunday lunch, overhead" },
    { img: "guest-white-tee", g: "company", alt: "Avocado toast on the terrace" }
  ]
};
