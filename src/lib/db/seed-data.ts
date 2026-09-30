import type { NewCategory, NewProduct } from './schema';

/**
 * The catalogue BJS signed off on. Prices are in paise, so a display price of
 * Rs 8,94,800 is stored as 89_480_000.
 */
export const seedCategories: NewCategory[] = [
  { id: 'c1', name: 'Bridal Sets', slug: 'bridal-sets', motif: 'set', position: 1, blurb: 'Complete wedding sets, necklace to maang tikka.' },
  { id: 'c2', name: 'Necklaces', slug: 'necklaces', motif: 'necklace', position: 2, blurb: 'Rani haars, chokers and temple work.' },
  { id: 'c3', name: 'Bangles & Kadas', slug: 'bangles-kadas', motif: 'bangle', position: 3, blurb: 'Handcrafted in pairs and sets of six.' },
  { id: 'c4', name: 'Earrings', slug: 'earrings', motif: 'earring', position: 4, blurb: 'Jhumkas, chandbalis and everyday studs.' },
  { id: 'c5', name: 'Rings', slug: 'rings', motif: 'ring', position: 5, blurb: 'Solitaires, navratna and engraved bands.' },
  { id: 'c6', name: 'Pendants & Chains', slug: 'pendants-chains', motif: 'pendant', position: 6, blurb: 'Coin pendants, drops and rope chains.' },
];

export const seedProducts: NewProduct[] = [
  {
    id: 'p1', name: 'Sanghamitra Bridal Set', slug: 'sanghamitra-bridal-set', categoryId: 'c1',
    priceMinor: 89480000, purity: '22KT', metal: 'Yellow Gold', weight: '84.2 g',
    stones: 'Uncut polki 6.4 ct, ruby beads', motif: 'set', tone: 't1', stock: 2, featured: true, tag: 'Bridal',
    description: 'A full bridal set in the Jaipur polki tradition: a seven-layer haar, matching chandbalis and a maang tikka. Uncut polki set in gold foil, finished with strung ruby beads along the rim.',
  },
  {
    id: 'p2', name: 'Rajwada Polki Necklace', slug: 'rajwada-polki-necklace', categoryId: 'c1',
    priceMinor: 56240000, purity: '22KT', metal: 'Yellow Gold', weight: '52.8 g',
    stones: 'Uncut polki 4.1 ct', motif: 'necklace', tone: 't2', stock: 3, featured: true,
    description: 'A court-style choker worn close at the throat, with a detachable centre motif that doubles as a brooch. Hand-set over three weeks by a single karigar.',
  },
  {
    id: 'p3', name: 'Meenakari Temple Set', slug: 'meenakari-temple-set', categoryId: 'c1',
    priceMinor: 53190000, purity: '22KT', metal: 'Yellow Gold', weight: '61.5 g',
    stones: 'Kemp stones, green enamel', motif: 'set', tone: 't3', stock: 1,
    description: 'South Indian temple work with enamel on the reverse, so the piece is finished on both faces. The goddess motif repeats across nine panels.',
  },
  {
    id: 'p4', name: 'Kundan Rani Haar', slug: 'kundan-rani-haar', categoryId: 'c2',
    priceMinor: 42650000, purity: '22KT', metal: 'Yellow Gold', weight: '44.0 g',
    stones: 'Kundan 3.2 ct, pearl drops', motif: 'necklace', tone: 't1', stock: 4, featured: true,
    description: 'A long haar that falls below the neckline, strung on silk thread so it moves with the wearer. Pearl drops run along the lower edge.',
  },
  {
    id: 'p5', name: 'Antique Lakshmi Necklace', slug: 'antique-lakshmi-necklace', categoryId: 'c2',
    priceMinor: 31870000, purity: '22KT', metal: 'Yellow Gold', weight: '38.6 g',
    stones: 'None', motif: 'necklace', tone: 't3', stock: 5,
    description: 'An antique matte finish, deliberately unpolished so the relief work holds shadow. A Lakshmi coin sits at the centre inside a granulated border.',
  },
  {
    id: 'p6', name: 'Chandrahaar Layered Chain', slug: 'chandrahaar-layered-chain', categoryId: 'c2',
    priceMinor: 22490000, purity: '22KT', metal: 'Yellow Gold', weight: '28.4 g',
    stones: 'None', motif: 'necklace', tone: 't2', stock: 6,
    description: 'Three crescents in graduating lengths, each worked in a different link. Light enough to wear through a full evening.',
  },
  {
    id: 'p7', name: 'Jaipuri Kada Pair', slug: 'jaipuri-kada-pair', categoryId: 'c3',
    priceMinor: 37820000, purity: '22KT', metal: 'Yellow Gold', weight: '46.2 g',
    stones: 'None', motif: 'bangle', tone: 't1', stock: 4, featured: true,
    description: 'A broad pair of kadas with a screw clasp, chased by hand in a repeating floral band. Sold as a pair.',
  },
  {
    id: 'p8', name: 'Filigree Bangles, Set of Six', slug: 'filigree-bangles-set-of-six', categoryId: 'c3',
    priceMinor: 28940000, purity: '22KT', metal: 'Yellow Gold', weight: '33.8 g',
    stones: 'None', motif: 'bangle', tone: 't3', stock: 7,
    description: 'Six thin bangles in drawn-wire filigree, made to be worn stacked. The openwork keeps the weight down without losing the width.',
  },
  {
    id: 'p9', name: 'Diamond-Cut Bangles', slug: 'diamond-cut-bangles', categoryId: 'c3',
    priceMinor: 15630000, purity: '18KT', metal: 'Rose Gold', weight: '21.4 g',
    stones: 'None', motif: 'bangle', tone: 't2', stock: 9,
    description: 'Machine diamond-cut facets that catch light from every angle. Rose gold, made for everyday wear with western clothes.',
  },
  {
    id: 'p10', name: 'Classic Gold Jhumka', slug: 'classic-gold-jhumka', categoryId: 'c4',
    priceMinor: 10710000, purity: '22KT', metal: 'Yellow Gold', weight: '12.6 g',
    stones: 'None', motif: 'earring', tone: 't1', stock: 12, featured: true,
    description: 'The everyday jhumka: a domed bell with a fringe of gold beads, sized so it clears the shoulder. Push-back fitting with a safety screw.',
  },
  {
    id: 'p11', name: 'Polki Chandbali', slug: 'polki-chandbali', categoryId: 'c4',
    priceMinor: 22860000, purity: '22KT', metal: 'Yellow Gold', weight: '18.9 g',
    stones: 'Uncut polki 2.1 ct', motif: 'earring', tone: 't2', stock: 5,
    description: 'A crescent chandbali with a polki centre and a pearl drop, supported by a chain over the ear so the weight sits on the head rather than the lobe.',
  },
  {
    id: 'p12', name: 'Everyday Polki Studs', slug: 'everyday-polki-studs', categoryId: 'c4',
    priceMinor: 5890000, purity: '18KT', metal: 'Yellow Gold', weight: '4.2 g',
    stones: 'Uncut polki 0.8 ct', motif: 'earring', tone: 't3', stock: 14,
    description: 'Small enough for the office, bright enough for the evening. A flat-back post keeps them sitting flush against the lobe.',
  },
  {
    id: 'p13', name: 'Solitaire Halo Ring', slug: 'solitaire-halo-ring', categoryId: 'c5',
    priceMinor: 17190000, purity: '18KT', metal: 'White Gold', weight: '3.6 g',
    stones: 'Solitaire 0.52 ct VVS1, halo 0.18 ct', motif: 'ring', tone: 't3', stock: 3, featured: true,
    description: 'A round brilliant in a four-prong setting with a pave halo. Certified by IGI, and the certificate travels with the ring.',
  },
  {
    id: 'p14', name: 'Navratna Statement Ring', slug: 'navratna-statement-ring', categoryId: 'c5',
    priceMinor: 13240000, purity: '22KT', metal: 'Yellow Gold', weight: '8.4 g',
    stones: 'Nine stones, astrologically placed', motif: 'ring', tone: 't1', stock: 4,
    description: 'Nine gemstones in their prescribed positions with a ruby at the centre, set open-backed so each stone touches the skin.',
  },
  {
    id: 'p15', name: 'Engraved Wedding Band', slug: 'engraved-wedding-band', categoryId: 'c5',
    priceMinor: 4970000, purity: '22KT', metal: 'Yellow Gold', weight: '5.8 g',
    stones: 'None', motif: 'ring', tone: 't2', stock: 10,
    description: 'A comfort-fit band with a hand-engraved vine running the full circumference. Inside engraving is complimentary.',
  },
  {
    id: 'p16', name: 'Lakshmi Coin Pendant', slug: 'lakshmi-coin-pendant', categoryId: 'c6',
    priceMinor: 7740000, purity: '22KT', metal: 'Yellow Gold', weight: '9.2 g',
    stones: 'None', motif: 'pendant', tone: 't1', stock: 8,
    description: 'A cast Lakshmi coin in a beaded bezel on an eighteen-inch rope chain. A first-jewellery gift, and a common choice for Dhanteras.',
  },
  {
    id: 'p17', name: 'Diamond Drop Pendant', slug: 'diamond-drop-pendant', categoryId: 'c6',
    priceMinor: 9620000, purity: '18KT', metal: 'White Gold', weight: '2.9 g',
    stones: 'Brilliant cut 0.31 ct', motif: 'pendant', tone: 't3', stock: 6,
    description: 'A single drop on a fine cable chain, set high so it reads clearly against the skin. Adjustable at sixteen and eighteen inches.',
  },
  {
    id: 'p18', name: 'Rope Chain, Twenty Inch', slug: 'rope-chain-twenty-inch', categoryId: 'c6',
    priceMinor: 12140000, purity: '22KT', metal: 'Yellow Gold', weight: '14.8 g',
    stones: 'None', motif: 'pendant', tone: 't2', stock: 11,
    description: 'A solid rope chain that holds its shape under a heavier pendant. Lobster clasp with a figure-eight safety.',
  },
];

export const seedOrders = [
  {
    id: 'o1', reference: 'BJS-24817', customerName: 'Meera Raghavan', phone: '98200 41277',
    email: 'meera@example.com', address: '12 Palm Grove, Bandra West', city: 'Mumbai', pincode: '400050',
    status: 'packed', paymentMethod: 'UPI', paymentReference: 'TXN2481744710',
    receiptName: 'gpay-receipt-1142.jpg',
    items: [
      { productId: 'p10', name: 'Classic Gold Jhumka', priceMinor: 10710000, quantity: 1, motif: 'earring', tone: 't1', imageUrl: null },
      { productId: 'p16', name: 'Lakshmi Coin Pendant', priceMinor: 7740000, quantity: 1, motif: 'pendant', tone: 't1', imageUrl: null },
    ],
    totalMinor: 18450000,
    createdAt: new Date('2026-09-27T14:12:00Z'),
  },
  {
    id: 'o2', reference: 'BJS-24818', customerName: 'Anjali Deshmukh', phone: '99304 88210',
    email: 'anjali@example.com', address: '4 Kothrud Heights', city: 'Pune', pincode: '411038',
    status: 'confirmed', paymentMethod: 'UPI', paymentReference: 'TXN2481844711',
    receiptName: 'paytm-txn-90x.png',
    items: [
      { productId: 'p7', name: 'Jaipuri Kada Pair', priceMinor: 37820000, quantity: 1, motif: 'bangle', tone: 't1', imageUrl: null },
    ],
    totalMinor: 37820000,
    createdAt: new Date('2026-09-28T05:36:00Z'),
  },
  {
    id: 'o3', reference: 'BJS-24819', customerName: 'Rohit Khanna', phone: '98110 63009',
    email: 'rohit@example.com', address: '77 Greater Kailash II', city: 'Delhi', pincode: '110048',
    status: 'pending', paymentMethod: 'Bank transfer', paymentReference: 'UTR553102884471',
    receiptName: 'bank-transfer-4471.jpg',
    items: [
      { productId: 'p13', name: 'Solitaire Halo Ring', priceMinor: 17190000, quantity: 1, motif: 'ring', tone: 't3', imageUrl: null },
    ],
    totalMinor: 17190000,
    createdAt: new Date('2026-09-29T15:48:00Z'),
  },
  {
    id: 'o4', reference: 'BJS-24820', customerName: 'Sneha Iyer', phone: '97400 55182',
    email: 'sneha@example.com', address: '19 Indiranagar 12th Main', city: 'Bengaluru', pincode: '560038',
    status: 'pending', paymentMethod: 'UPI', paymentReference: 'TXN2482044713',
    receiptName: 'upi-screenshot.jpg',
    items: [
      { productId: 'p4', name: 'Kundan Rani Haar', priceMinor: 42650000, quantity: 1, motif: 'necklace', tone: 't1', imageUrl: null },
      { productId: 'p12', name: 'Everyday Polki Studs', priceMinor: 5890000, quantity: 2, motif: 'earring', tone: 't3', imageUrl: null },
    ],
    totalMinor: 54430000,
    createdAt: new Date('2026-09-30T02:34:00Z'),
  },
];
