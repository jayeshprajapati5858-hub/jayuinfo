
import pg from 'pg';

const { Pool } = pg;

const connectionString = 'postgresql://neondb_owner:npg_N5Pl8HTUOywj@ep-still-wind-adtlfp21-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

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
    image TEXT,
    date TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE TABLE IF NOT EXISTS notices (
    id SERIAL PRIMARY KEY, 
    type TEXT, 
    title TEXT, 
    description TEXT, 
    date_str TEXT, 
    contact_person TEXT, 
    mobile TEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY, 
    category TEXT, 
    title TEXT, 
    details TEXT, 
    wages TEXT, 
    contact_name TEXT, 
    mobile TEXT, 
    date_str TEXT
  );

  CREATE TABLE IF NOT EXISTS marketplace (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    price TEXT NOT NULL,
    description TEXT,
    owner_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    date_str TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const initDb = async () => {
  try {
    await pool.query(createTableQuery);
    console.log("✅ Tables verified (news, notices, jobs, marketplace).");
    
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
        content: `કેન્દ્ર સરકાર દ્વારા 'બેટી બચાવો બેટી પઢાવો' અંતર્ગત સુકન્યા સમૃદ્ધિ યોજના ચલાવવામાં આવે છે. આ યોજનામાં વાર્ષિક ૨૫૦ રૂપિયાથી લઈને ૧.૫ લાખ રૂપિયા સુધીનું રોકાણ કરી શકાય છે.

ફાયદાઓ:
૧. વર્તમાન વ્યાજ દર: ૮.૨% (વાર્ષિક).
૨. ટેક્સમાં રાહત (80C હેઠળ).
૩. દીકરી ૧૮ વર્ષની થાય ત્યારે ૫૦% રકમ અને ૨૧ વર્ષે પૂરી રકમ મળે.

ખાતું ક્યાં ખોલાવવું?
નજીકની પોસ્ટ ઓફિસ અથવા કોઈ પણ રાષ્ટ્રીયકૃત બેંકમાં આ ખાતું ખોલાવી શકાય છે.`,
        media_url: "https://images.unsplash.com/photo-1623050040776-37b0c841c6f3?auto=format&fit=crop&q=80&w=1000",
        media_type: "image",
        date: "20 May 2024"
      },
      {
        title: "આયુષ્માન કાર્ડ (PM-JAY) હવે મોબાઈલથી ડાઉનલોડ કરો",
        category: "આરોગ્ય",
        summary: "૫ લાખ સુધીની મફત સારવાર આપતું આયુષ્માન કાર્ડ હવે ઘરે બેઠા તમારા ફોનમાં ડાઉનલોડ કરી શકાય છે.",
        content: `પ્રધાનમંત્રી જન આરોગ્ય યોજના (PM-JAY) હેઠળ ગરીબ અને મધ્યમ વર્ગના પરિવારોને વાર્ષિક ૫ લાખ સુધીની મફત સારવાર મળે છે.

કેવી રીતે ડાઉનલોડ કરવું?
૧. 'Ayushman App' ડાઉનલોડ કરો.
૨. લોગિન કરો (Beneficiary તરીકે).
૩. મોબાઈલ નંબર અને OTP નાખો.
૪. રાજ્ય અને સ્કીમ પસંદ કરી સર્ચ કરો.
૫. આધાર ઓથોન્ટિકેશન કરી કાર્ડ ડાઉનલોડ કરો.`,
        media_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000",
        media_type: "image",
        date: "20 May 2024"
      },
      {
        title: "કપાસના ભાવમાં તેજી: APMC માં મણનો ભાવ ૧૭૦૦ ને પાર",
        category: "ખેતીવાડી",
        summary: "સૌરાષ્ટ્રના માર્કેટ યાર્ડમાં કપાસની આવક ઘટતા ભાવમાં ઉછાળો જોવા મળ્યો. ખેડૂતોમાં આનંદ.",
        content: `ચાલુ વર્ષે કપાસનું ઉત્પાદન ઓછું હોવાને કારણે અને આંતરરાષ્ટ્રીય માંગ વધવાને કારણે કપાસના ભાવમાં સુધારો જોવા મળી રહ્યો છે. ધ્રાંગધ્રા અને હળવદ યાર્ડમાં સારી ગુણવત્તાના કપાસનો ભાવ ૧૭૦૦ થી ૧૭૫૦ સુધી બોલાયો હતો. નિષ્ણાતોના મતે હજુ પણ ભાવ વધવાની શક્યતા છે.`,
        media_url: "https://images.unsplash.com/photo-1599581843324-7e77747e0996?auto=format&fit=crop&q=80&w=1000",
        media_type: "image",
        date: "20 May 2024"
      },
      {
        title: "ચોમાસાની આગાહી ૨૦૨૪: ગુજરાતમાં ક્યારે થશે એન્ટ્રી?",
        category: "સમાચાર",
        summary: "હવામાન વિભાગની નવી આગાહી મુજબ આ વર્ષે ચોમાસું સામાન્ય કરતા વહેલું બેસવાની શક્યતા.",
        content: `ભારતીય હવામાન વિભાગ (IMD) અનુસાર, આ વર્ષે કેરળમાં ૩૧ મે સુધીમાં ચોમાસું બેસી જશે. ગુજરાતમાં ૧૫ થી ૨૦ જૂન વચ્ચે વિધિવત ચોમાસાનું આગમન થવાની વકી છે. આ વર્ષે 'લા-નીના' અસરને કારણે સારો વરસાદ થવાની સંભાવના છે, જે ખેડૂતો માટે સારા સમાચાર છે.`,
        media_url: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=1000",
        media_type: "image",
        date: "20 May 2024"
      },
      {
        title: "ડિજિટલ ગુજરાત સ્કોલરશીપ: વિદ્યાર્થીઓ માટે અરજી શરૂ",
        category: "શિક્ષણ",
        summary: "SC, ST, OBC અને EBC વિદ્યાર્થીઓ માટે પોસ્ટ મેટ્રિક સ્કોલરશીપના ફોર્મ ભરવાની તારીખ જાહેર.",
        content: `ગુજરાત સરકારના સામાજિક ન્યાય અને અધિકારિતા વિભાગ દ્વારા વર્ષ ૨૦૨૪-૨૫ માટે શિષ્યવૃત્તિ પોર્ટલ ખુલ્લું મુકવામાં આવ્યું છે. ધોરણ ૧૧-૧૨, કોલેજ અને આઈ.ટી.આઈ. ના વિદ્યાર્થીઓ 'Digital Gujarat' પોર્ટલ પર ઓનલાઇન અરજી કરી શકે છે. છેલ્લી તારીખ ૩૧ જુલાઈ છે.`,
        media_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1000",
        media_type: "image",
        date: "20 May 2024"
      },
      {
        title: "પીએમ કિસાન સન્માન નિધિ: ૧૭મો હપ્તો ક્યારે આવશે?",
        category: "ખેતીવાડી",
        summary: "દેશના કરોડો ખેડૂતો ૧૭મા હપ્તાની રાહ જોઈ રહ્યા છે. જાણો તારીખ અને સ્ટેટસ ચેક કરવાની રીત.",
        content: `પ્રધાનમંત્રી કિસાન સન્માન નિધિ યોજના હેઠળ ખેડૂતોને વાર્ષિક ૬૦૦૦ રૂપિયા આપવામાં આવે છે. સૂત્રોના જણાવ્યા મુજબ, ૧૭મો હપ્તો જૂન મહિનાના પહેલા અઠવાડિયામાં જમા થવાની શક્યતા છે. ખેડૂતોએ પોતાનું e-KYC કરાવવું ફરજિયાત છે. સ્ટેટસ ચેક કરવા pmkisan.gov.in ની મુલાકાત લો.`,
        media_url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=1000",
        media_type: "image",
        date: "20 May 2024"
      },
      {
        title: "જન ધન ખાતાના ફાયદા: મફત વીમો અને ઓવરડ્રાફ્ટ સુવિધા",
        category: "બેંકિંગ",
        summary: "જો તમારું જન ધન ખાતું છે તો તમને મળે છે ૨ લાખનો અકસ્માત વીમો. જાણો અન્ય લાભો.",
        content: `પ્રધાનમંત્રી જન ધન યોજના (PMJDY) હેઠળ ઝીરો બેલેન્સ ખાતું ખોલવામાં આવે છે.
        
ફાયદા:
૧. જમા રકમ પર વ્યાજ.
૨. ૨ લાખ રૂપિયાનો અકસ્માત વીમો (RuPay કાર્ડ પર).
૩. ૩૦,૦૦૦ રૂપિયાનું જીવન વીમા કવર.
૪. ૧૦,૦૦૦ રૂપિયા સુધીની ઓવરડ્રાફ્ટ સુવિધા.`,
        media_url: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&q=80&w=1000",
        media_type: "image",
        date: "20 May 2024"
      },
      {
        title: "સોલાર રૂફટોપ સબસિડી: વીજળી બિલ ઝીરો કરવાની તક",
        category: "યોજના",
        summary: "પીએમ સૂર્ય ઘર મફત વીજળી યોજના હેઠળ ૩૦૦ યુનિટ સુધી મફત વીજળી અને સબસિડી.",
        content: `સરકાર દ્વારા સોલાર પેનલ લગાવવા માટે જબરદસ્ત સબસિડી આપવામાં આવે છે. ૧ કિલોવોટ થી ૨ કિલોવોટ સુધી ૩૦,૦૦૦ થી૬૦,૦૦૦ સુધીની સબસિડી મળી શકે છે. આનાથી તમારું લાઈટ બિલ લગભગ શૂન્ય થઈ જશે. pmsuryaghar.gov.in પર રજીસ્ટ્રેશન કરાવો.`,
        media_url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=1000",
        media_type: "image",
        date: "20 May 2024"
      },
      {
        title: "મતદાર યાદીમાં નામ સુધારણા કાર્યક્રમ",
        category: "સમાચાર",
        summary: "ચૂંટણી કાર્ડમાં નામ, સરનામું સુધારવા અથવા નવું કાર્ડ કઢાવવા માટે ખાસ ઝુંબેશ.",
        content: `ચૂંટણી પંચ દ્વારા મતદાર યાદી સુધારણા કાર્યક્રમ જાહેર કરવામાં આવ્યો છે. જો તમારા કાર્ડમાં કોઈ ભૂલ હોય, ફોટો બદલવો હોય કે સરનામું બદલવું હોય તો 'Voter Helpline App' દ્વારા ઘરે બેઠા અરજી કરી શકો છો. ૧૮ વર્ષ પૂર્ણ કરનાર યુવાનો નવું કાર્ડ પણ કઢાવી શકશે.`,
        media_url: "https://images.unsplash.com/photo-1540910419868-4749459ca6c8?auto=format&fit=crop&q=80&w=1000",
        media_type: "image",
        date: "20 May 2024"
      }
    ];

    for (const article of articles) {
      const query = `
        INSERT INTO news (title, category, summary, content, image, date)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      // Use media_url as image column
      await pool.query(query, [article.title, article.category, article.summary, article.content, article.media_url, article.date]);
    }
    console.log("✅ Seed data inserted successfully.");

  } catch (err) {
    console.error("❌ Database Init Error:", err);
  } finally {
    await pool.end();
  }
};

initDb();
