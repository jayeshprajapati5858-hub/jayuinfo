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
    console.log("✅ 'news' table created successfully.");
    
    // Check if table is empty
    const checkCount = await pool.query('SELECT COUNT(*) FROM news');
    
    // If empty, insert the High-Quality AdSense Content
    if (parseInt(checkCount.rows[0].count) === 0) {
        console.log("Inserting High-Quality AdSense Content...");
        
        const articles = [
          {
            title: "રેશન કાર્ડમાં નામ ઉમેરવું છે? જાણો નવી પ્રક્રિયા અને જરૂરી પુરાવા",
            category: "યોજના",
            summary: "નવા જન્મેલા બાળકનું કે પત્નીનું નામ રેશન કાર્ડમાં ઉમેરવા માટે કયા ફોર્મ ભરવા અને ક્યાં જવું તેની સંપૂર્ણ માહિતી.",
            content: `ઘણા લોકોને રેશન કાર્ડમાં નવા સભ્યનું નામ (જેમ કે નવું જન્મેલું બાળક અથવા લગ્ન પછી પત્નીનું નામ) ઉમેરવામાં મુશ્કેલી પડતી હોય છે. અહીં તેની સરળ રીત આપી છે.

જરૂરી દસ્તાવેજો (Documents Required):
૧. રેશન કાર્ડની નકલ (બારકોડેડ).
૨. કુટુંબના મોભીનું આધાર કાર્ડ અને ચૂંટણી કાર્ડ.
૩. જેનું નામ ઉમેરવાનું છે તેનો જન્મનો દાખલો (બાળક હોય તો).
૪. લગ્નનું પ્રમાણપત્ર અને પિયરનું રેશન કાર્ડ કમી કર્યાનો દાખલો (પત્નીનું નામ ઉમેરવા માટે).
૫. લાઈટ બિલ અથવા વેરા પહોંચ.

પ્રક્રિયા (Process):
- તમારે તમારા તાલુકાની મામલતદાર કચેરી અથવા જન સેવા કેન્દ્ર પર જવું પડશે.
- ત્યાંથી 'ફોર્મ નં. ૩' (નામ ઉમેરવાનું ફોર્મ) મેળવો.
- ફોર્મ ભરી, ઉપર મુજબના પુરાવા જોડીને જન સેવા કેન્દ્રમાં જમા કરાવો.
- અરજી મંજૂર થયા બાદ, ૧૫ થી ૩૦ દિવસમાં તમને નવું રેશન કાર્ડ અથવા સ્લીપ મળી જશે.

ઓનલાઇન અરજી:
તમે 'Digital Gujarat' પોર્ટલ પર જઈને પણ ઓનલાઇન અરજી કરી શકો છો.`,
            media_url: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?auto=format&fit=crop&q=80&w=1000",
            media_type: "image",
            date: "16 May 2024"
          },
          {
            title: "સુકન્યા સમૃદ્ધિ યોજના: દીકરીના ભવિષ્ય માટે શ્રેષ્ઠ બચત (SSY)",
            category: "યોજના",
            summary: "દીકરીના લગ્ન અને ભણતર માટે સરકારની સૌથી વધુ વ્યાજ આપતી યોજના. જાણો ખાતું ક્યાં ખોલાવવું.",
            content: `દીકરીના ઉજ્જવળ ભવિષ્ય માટે કેન્દ્ર સરકારની 'બેટી બચાવો, બેટી પઢાવો' અભિયાન અંતર્ગત 'સુકન્યા સમૃદ્ધિ યોજના' (SSY) અમલમાં છે.

યોજનાના મુખ્ય ફાયદા:
- વ્યાજ દર: હાલમાં આ યોજના પર ૮.૨% જેટલું ઊંચું વ્યાજ મળે છે.
- ટેક્સ મુક્તિ: કલમ 80C હેઠળ ટેક્સમાં બાદ મળે છે.
- પાકતી મુદત: ખાતું ખોલાવ્યાના ૨૧ વર્ષ પછી પૂરી રકમ વ્યાજ સહિત મળે છે.

કોણ ખાતું ખોલાવી શકે?
- ૧૦ વર્ષથી ઓછી ઉંમરની દીકરીના માતા-પિતા આ ખાતું ખોલાવી શકે છે.
- એક પરિવારમાં વધુમાં વધુ બે દીકરીઓ માટે ખાતું ખોલાવી શકાય.

જરૂરી ડોક્યુમેન્ટ્સ:
૧. દીકરીનું જન્મ પ્રમાણપત્ર.
૨. માતા-પિતાનું આધાર કાર્ડ અને પાન કાર્ડ.
૩. પાસપોર્ટ સાઈઝ ફોટો.

ક્યાં ખોલાવવું?
તમે નજીકની પોસ્ટ ઓફિસ અથવા કોઈપણ રાષ્ટ્રીયકૃત બેંકમાં માત્ર ૨૫૦ રૂપિયાથી ખાતું ખોલાવી શકો છો.`,
            media_url: "https://images.unsplash.com/photo-1606189911688-4672c8340d85?auto=format&fit=crop&q=80&w=1000",
            media_type: "image",
            date: "15 May 2024"
          },
          {
            title: "ચૂંટણી કાર્ડ સાથે આધાર કાર્ડ લિંક કરવાની સરળ રીત (Voter ID Link)",
            category: "અન્ય",
            summary: "ચૂંટણી પંચ દ્વારા મતદાર યાદી સુધારણા કાર્યક્રમ શરૂ છે. ઘરે બેઠા મોબાઈલથી લિંક કરવાની સ્ટેપ-બાય-સ્ટેપ ગાઈડ.",
            content: `ભારત સરકાર અને ચૂંટણી પંચ દ્વારા બોગસ વોટિંગ અટકાવવા માટે ચૂંટણી કાર્ડ (Voter ID) ને આધાર કાર્ડ સાથે લિંક કરવાનું અભિયાન ચાલુ છે.

કેવી રીતે લિંક કરવું? (ઓનલાઇન રીત):
૧. મોબાઈલમાં 'Voter Helpline App' ડાઉનલોડ કરો અથવા 'NVSP' પોર્ટલ પર જાઓ.
૨. 'Voter Registration' સેક્શનમાં જાઓ.
૩. 'Form 6B' પસંદ કરો.
૪. તમારો મોબાઈલ નંબર નાખી OTP વેરીફાય કરો.
૫. તમારો EPIC (ચૂંટણી કાર્ડ) નંબર નાખો.
૬. આધાર નંબર દાખલ કરો અને સબમિટ કરો.

ઓફલાઇન રીત:
તમે તમારા વિસ્તારના BLO (બૂથ લેવલ ઓફિસર) નો સંપર્ક કરીને ફોર્મ 6B ભરીને આપી શકો છો.

આ પ્રક્રિયા ફરજિયાત નથી પરંતુ સ્વૈચ્છિક છે, છતાં લોકશાહીને મજબૂત બનાવવા માટે લિંક કરવું હિતાવહ છે.`,
            media_url: "https://images.unsplash.com/photo-1597893963495-259169f41b37?auto=format&fit=crop&q=80&w=1000",
            media_type: "image",
            date: "14 May 2024"
          },
          {
            title: "પી.એમ. કિસાન યોજના: ૧૭મો હપ્તો જમા થયો કે નહિ? ઘરે બેઠા તપાસો",
            category: "ખેતી",
            summary: "પી.એમ. કિસાન સન્માન નિધિ યોજના અંતર્ગત ખેડૂતોના ખાતામાં ૨૦૦૦ રૂપિયા જમા થયા છે કે કેમ તે જાણવા માટેની સંપૂર્ણ રીત.",
            content: `પી.એમ. કિસાન સન્માન નિધિ યોજના ભારત સરકારની ખેડૂતો માટેની સૌથી મોટી યોજના છે. ઘણા ખેડૂત મિત્રોને પ્રશ્ન હોય છે કે તેમના ખાતામાં હપ્તો જમા થયો છે કે નહિ.

તમારું સ્ટેટસ આ રીતે તપાસો:
૧. સૌ પ્રથમ pmkisan.gov.in વેબસાઇટ પર જાઓ.
૨. ત્યાં 'Know Your Status' પર ક્લિક કરો.
૩. તમારો રજીસ્ટ્રેશન નંબર અને કેપ્ચા કોડ નાખો.
૪. હવે તમારા મોબાઈલ પર OTP આવશે તે દાખલ કરો.

મહત્વની નોંધ (eKYC):
જો તમારા ખાતામાં પૈસા નથી આવ્યા, તો તમારું eKYC બાકી હોઈ શકે છે. તમે નજીકના CSC સેન્ટર પર જઈને અથવા જાતે મોબાઈલ દ્વારા eKYC કરી શકો છો.`,
            media_url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=1000",
            media_type: "image",
            date: "13 May 2024"
          },
          {
            title: "આયુષ્માન કાર્ડ: ૫ લાખ સુધીની મફત સારવાર કેવી રીતે મેળવવી?",
            category: "આરોગ્ય",
            summary: "બીમારીના ખર્ચથી બચવા માટે આયુષ્માન ભારત કાર્ડ હોવું ખૂબ જરૂરી છે. જાણો કયા દસ્તાવેજો જોઈએ અને ક્યાં કઢાવવું.",
            content: `આયુષ્માન ભારત યોજના ગરીબ અને મધ્યમ વર્ગના પરિવારો માટે આશીર્વાદ સમાન છે. આ કાર્ડ દ્વારા તમે સરકારી તેમજ માન્ય ખાનગી હોસ્પિટલમાં વાર્ષિક ૫ લાખ રૂપિયા સુધીની મફત સારવાર મેળવી શકો છો.

જરૂરી દસ્તાવેજો:
- રેશન કાર્ડ (અંત્યોદય અથવા BPL/APL)
- આધાર કાર્ડ (દરેક સભ્યનું)
- આવકનો દાખલો (જો લાગુ પડતું હોય તો)
- મોબાઈલ નંબર (આધાર સાથે લિંક હોવો જોઈએ)

ક્યાં કઢાવવું?
તમે આપણી ગ્રામ પંચાયત કચેરીએ VCE ઓપરેટર પાસે અથવા નજીકના સરકારી દવાખાને જઈને આ કાર્ડ કઢાવી શકો છો. ઓપરેશન, કેન્સર, હૃદયરોગ જેવી ગંભીર બીમારીઓમાં આ કાર્ડ ખૂબ ઉપયોગી છે.`,
            media_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000",
            media_type: "image",
            date: "12 May 2024"
          }
        ];

        for (const article of articles) {
            await pool.query(
                `INSERT INTO news (title, category, summary, content, media_url, media_type, date) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [article.title, article.category, article.summary, article.content, article.media_url, article.media_type, article.date]
            );
        }
        console.log("✅ 5 High-Quality AdSense articles inserted.");
    }

  } catch (err) {
    console.error("❌ Error initializing database:", err);
  } finally {
    await pool.end();
  }
};

initDb();