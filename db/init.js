import pg from 'pg';

const { Pool } = pg;

const connectionString = 'postgresql://neondb_owner:npg_LZ5H2AChwUGB@ep-sparkling-block-a4stnq97-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    media_url TEXT,
    media_type TEXT,
    date TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const initDb = async () => {
  try {
    await pool.query(createTableQuery);
    console.log("✅ 'news' table verified.");
    
    // 10 AdSense Optimized Articles List
    const articles = [
      {
        title: "રેશન કાર્ડમાં નવું નામ કેવી રીતે ઉમેરવું? જાણો સંપૂર્ણ પ્રક્રિયા",
        category: "યોજના",
        summary: "તમારા પરિવારના નવા સભ્ય અથવા પત્નીનું નામ રેશન કાર્ડમાં ઉમેરવા માટે કયા કયા પુરાવા જોઈએ તેની યાદી.",
        content: `રેશન કાર્ડ એ માત્ર અનાજ મેળવવાનું સાધન નથી, પણ એક મહત્વનો ઓળખનો પુરાવો પણ છે. લગ્ન પછી પત્નીનું નામ ઉમેરવું હોય કે નવજાત બાળકનું નામ, નીચે મુજબની પ્રક્રિયા અનુસરો.

જરૂરી દસ્તાવેજો:
૧. પત્નીનું નામ ઉમેરવા માટે: પિયરના રેશન કાર્ડમાંથી નામ કમી કર્યાનો દાખલો અને લગ્નનું પ્રમાણપત્ર.
૨. બાળક માટે: જન્મનો દાખલો અને માતા-પિતાનું રેશન કાર્ડ.
૩. રહેઠાણનો પુરાવો (લાઈટ બિલ અથવા વેરા પહોંચ).
૪. દરેક સભ્યના આધાર કાર્ડ.

ક્યાં અરજી કરવી?
તમારે તમારા તાલુકાની મામલતદાર કચેરી અથવા જન સેવા કેન્દ્ર પર જઈને 'ફોર્મ નંબર ૩' ભરવાનું રહેશે. આ ફોર્મ ઓનલાઇન 'Digital Gujarat' પોર્ટલ પરથી પણ ભરી શકાય છે.`,
        media_url: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?auto=format&fit=crop&q=80&w=1000",
        media_type: "image",
        date: "20 May 2024"
      },
      {
        title: "સુકન્યા સમૃદ્ધિ યોજના ૨૦૨૪: દીકરીના લગ્ન અને ભણતર માટે સૌથી વધુ વ્યાજ",
        category: "યોજના",
        summary: "દીકરીનું ભવિષ્ય સુરક્ષિત કરવા માટે કેન્દ્ર સરકારની આ યોજનામાં ૮.૨% વ્યાજ મળી રહ્યું છે. જાણો કેવી રીતે ખાતું ખોલાવવું.",
        content: `કેન્દ્ર સરકાર દ્વારા 'બેટી બચાવો બેટી પઢાવો' અંતર્ગત સુકન્યા સમૃદ્ધિ યોજના ચલાવવામાં આવે છે. આ યોજનામાં વાર્ષિક ૨૫૦ રૂપિયાથી લઈને ૧.૫ લાખ રૂપિયા