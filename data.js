// ============================================================
// PROPBOT — Property Database
// ============================================================
const PROPS = [
  {
    id: 1, name: "Ramest Tower", area: "Panjabari", loc: "Namghar Path",
    bhk: 3, flatId: "A01-A04", area_sqft: 1388, carpet: 1041, floors: "1-4",
    totalFlats: 24, perSqft: 4500, parking: "₹2L", amenities: "General amenities",
    usp: "Lowest price at Panjabari", price: "₹65.96L", priceRaw: 6596000,
    status: "Pilling Completed", possession: "Dec 2028", rera: true,
    invest: 9.5, livability: 9.0, road: 9, sun: 9.5, noise: "Low",
    rent: 25000, yield: "4.6%", appreciation: "Very High",
    school: "2 KM", hospital: "1.5 KM", airport: "28 KM", mainRoad: "0.7 KM",
    banks: "SBI,HDFC,ICICI", water: "Available", idealFor: "Family, retired"
  },
  {
    id: 2, name: "Ramest Tower", area: "Panjabari", loc: "Namghar Path",
    bhk: 3, flatId: "B01-B04", area_sqft: 1246, carpet: 934, floors: "1-4",
    totalFlats: 24, perSqft: 4500, parking: "₹2L", amenities: "General amenities",
    usp: "Lowest price at Panjabari", price: "₹59.57L", priceRaw: 5957000,
    status: "Pilling Completed", possession: "Dec 2028", rera: true,
    invest: 9.5, livability: 9.0, road: 9, sun: 9.5, noise: "Low",
    rent: 22000, yield: "4.3%", appreciation: "Very High",
    school: "2 KM", hospital: "1.5 KM", airport: "28 KM", mainRoad: "0.7 KM",
    banks: "SBI,HDFC,ICICI", water: "Available", idealFor: "Family, retired"
  },
  {
    id: 3, name: "Ramest Tower", area: "Panjabari", loc: "Namghar Path",
    bhk: 3, flatId: "C01-C04", area_sqft: 1180, carpet: 885, floors: "1-4",
    totalFlats: 24, perSqft: 4500, parking: "₹2L", amenities: "General amenities",
    usp: "Lowest price at Panjabari", price: "₹56.60L", priceRaw: 5660000,
    status: "Pilling Completed", possession: "Dec 2028", rera: true,
    invest: 9.5, livability: 9.0, road: 9, sun: 9.5, noise: "Low",
    rent: 20000, yield: "4.0%", appreciation: "Very High",
    school: "2 KM", hospital: "1.5 KM", airport: "28 KM", mainRoad: "0.7 KM",
    banks: "SBI,HDFC,ICICI", water: "Available", idealFor: "Family, retired"
  },
  {
    id: 4, name: "Ramest Tower", area: "Panjabari", loc: "Namghar Path",
    bhk: 3, flatId: "D01-D04", area_sqft: 1111, carpet: 833, floors: "1-4",
    totalFlats: 24, perSqft: 4500, parking: "₹2L", amenities: "General amenities",
    usp: "Lowest price at Panjabari", price: "₹53.49L", priceRaw: 5349000,
    status: "Pilling Completed", possession: "Dec 2028", rera: true,
    invest: 9.5, livability: 9.0, road: 9, sun: 9.5, noise: "Low",
    rent: 20000, yield: "4.0%", appreciation: "Very High",
    school: "2 KM", hospital: "1.5 KM", airport: "28 KM", mainRoad: "0.7 KM",
    banks: "SBI,HDFC,ICICI", water: "Available", idealFor: "Family, retired"
  },
  {
    id: 5, name: "Discovery Villa", area: "Beltola", loc: "Opp. Bhabendralay",
    bhk: 3, flatId: "K1", area_sqft: 2513, carpet: 1884, floors: "G+1",
    totalFlats: 18, perSqft: 6500, parking: "₹3L", amenities: "Gym, Club House",
    usp: "Premium duplex flat", price: "₹1.70Cr", priceRaw: 17000000,
    status: "Ready To Move", possession: "Apr 2026", rera: true,
    invest: 9.0, livability: 9.5, road: 10, sun: 10, noise: "Low",
    rent: 40000, yield: "3.0%", appreciation: "High",
    school: "1.5 KM", hospital: "2 KM", airport: "20 KM", mainRoad: "0.1 KM",
    banks: "SBI,HDFC", water: "Available", idealFor: "Big family, duplex"
  },
  {
    id: 6, name: "Discovery Villa", area: "Beltola", loc: "Opp. Bhabendralay",
    bhk: 3, flatId: "N2", area_sqft: 2476, carpet: 1857, floors: "G+1",
    totalFlats: 18, perSqft: 6500, parking: "₹3L", amenities: "Gym, Club House",
    usp: "Premium duplex flat", price: "₹1.62Cr", priceRaw: 16200000,
    status: "Ready To Move", possession: "Apr 2026", rera: true,
    invest: 9.0, livability: 9.5, road: 10, sun: 9.5, noise: "Low",
    rent: 40000, yield: "3.5%", appreciation: "High",
    school: "1.5 KM", hospital: "2 KM", airport: "20 KM", mainRoad: "0.1 KM",
    banks: "SBI,HDFC", water: "Available", idealFor: "Big family, duplex"
  },
  {
    id: 7, name: "Discovery Villa", area: "Beltola", loc: "Opp. Bhabendralay",
    bhk: 4, flatId: "O2", area_sqft: 2748, carpet: 2061, floors: "G+1",
    totalFlats: 18, perSqft: 6500, parking: "₹3L", amenities: "Gym, Club House",
    usp: "Premium duplex flat", price: "₹1.82Cr", priceRaw: 18200000,
    status: "Ready To Move", possession: "Apr 2026", rera: true,
    invest: 9.0, livability: 9.5, road: 10, sun: 9.5, noise: "Low",
    rent: 40000, yield: "3.5%", appreciation: "High",
    school: "1.5 KM", hospital: "2 KM", airport: "20 KM", mainRoad: "0.1 KM",
    banks: "SBI,HDFC", water: "Available", idealFor: "Big family, duplex"
  },
  {
    id: 8, name: "Discovery Villa", area: "Beltola", loc: "Opp. Bhabendralay",
    bhk: 4, flatId: "A4", area_sqft: 2620, carpet: 1965, floors: "G+1",
    totalFlats: 18, perSqft: 6500, parking: "₹3L", amenities: "Gym, Club House",
    usp: "Premium duplex flat", price: "₹1.76Cr", priceRaw: 17600000,
    status: "Ready To Move", possession: "Apr 2026", rera: true,
    invest: 9.0, livability: 9.5, road: 10, sun: 9.0, noise: "Low",
    rent: 40000, yield: "3.5%", appreciation: "High",
    school: "1.5 KM", hospital: "2 KM", airport: "20 KM", mainRoad: "0.1 KM",
    banks: "SBI,HDFC", water: "Available", idealFor: "Big family, duplex"
  },
  {
    id: 9, name: "Discovery Villa", area: "Beltola", loc: "Opp. Bhabendralay",
    bhk: 4, flatId: "B4", area_sqft: 2640, carpet: 1980, floors: "G+1",
    totalFlats: 18, perSqft: 6500, parking: "₹3L", amenities: "Gym, Club House",
    usp: "Premium duplex flat", price: "₹1.76Cr", priceRaw: 17600000,
    status: "Ready To Move", possession: "Apr 2026", rera: true,
    invest: 9.0, livability: 9.5, road: 10, sun: 9.0, noise: "Low",
    rent: 40000, yield: "3.5%", appreciation: "High",
    school: "1.5 KM", hospital: "2 KM", airport: "20 KM", mainRoad: "0.1 KM",
    banks: "SBI,HDFC", water: "Available", idealFor: "Big family, duplex"
  },
  {
    id: 10, name: "Discovery Villa", area: "Beltola", loc: "Opp. Bhabendralay",
    bhk: 3, flatId: "C3,C4", area_sqft: 1675, carpet: 1256, floors: "2-3",
    totalFlats: 18, perSqft: 6500, parking: "₹3L", amenities: "Gym, Club House",
    usp: "Premium 3BHK at Beltola", price: "₹1.15Cr", priceRaw: 11500000,
    status: "Ready To Move", possession: "Apr 2026", rera: true,
    invest: 9.0, livability: 9.5, road: 10, sun: 9.5, noise: "Low",
    rent: 25000, yield: "3.0%", appreciation: "High",
    school: "1.5 KM", hospital: "2 KM", airport: "20 KM", mainRoad: "0.1 KM",
    banks: "SBI,HDFC", water: "Available", idealFor: "Family, Individual"
  },
  {
    id: 11, name: "Discovery Villa", area: "Beltola", loc: "Opp. Bhabendralay",
    bhk: 4, flatId: "Special", area_sqft: 3000, carpet: 2250, floors: "G+1",
    totalFlats: 18, perSqft: 6500, parking: "₹3L", amenities: "Gym, Club House",
    usp: "Premium duplex flat", price: "₹2Cr", priceRaw: 20000000,
    status: "Ready To Move", possession: "Apr 2026", rera: true,
    invest: 9.0, livability: 9.5, road: 10, sun: 9.5, noise: "Low",
    rent: 40000, yield: "3.5%", appreciation: "High",
    school: "1.5 KM", hospital: "2 KM", airport: "20 KM", mainRoad: "0.1 KM",
    banks: "SBI,HDFC", water: "Available", idealFor: "Big family, duplex"
  }
];

const SYSTEM_PROMPT = `You are PropBot, a warm, expert real estate sales assistant for properties in Guwahati, Assam.

PROPERTY DATABASE:
${JSON.stringify(PROPS, null, 2)}

INSTRUCTIONS:
- Answer ONLY from this database. Never invent data.
- Be conversational, warm, professional. Max 3–4 short paragraphs.
- Use Indian formatting: lakhs, crores, ₹ symbol.
- Highlight invest score, rental yield, RERA status when relevant.
- When recommending, always mention: name, price, BHK, USP.
- If user writes in Assamese or Hindi, reply in that language.
- For budget queries, filter by priceRaw accurately.
- For investment queries, compare invest score, yield %, appreciation.
- Always end replies with a brief call-to-action (visit, call, ask more).`;
