import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css'; // Reuse dashboard styles

const recommendations = [
  { name: "Lupa Bengaluru", location: "MG Road", desc: "Modern European from risottos to bone marrow in a Tuscany-style courtyard.", img: "/images/lupa_bengaluru.png" },
  { name: "13th Floor Bar", location: "MG Road", desc: "Iconic rooftop bar promising great ambience and the best skyline views.", img: "/images/thirteenth_floor.png" },
  { name: "Kai", location: "Trinity Circle", desc: "Panoramic views from the 13th floor, featuring signature cocktails and global dishes.", img: "/images/glass_conservatory.png" },
  { name: "The Polo Club", location: "The Oberoi", desc: "A garden-facing verandah with global favorites and craft cocktails.", img: "/images/nexus_hub.png" },
  { name: "Lotus Pavilion", location: "ITC Gardenia", desc: "Eco-conscious living room with a living roof, perfect for alfresco dining.", img: "/images/petal_yeast.png" },
  { name: "Olive Beach", location: "Wood Street", desc: "Timeless Med charm with a sun-dappled courtyard and live grills under the stars.", img: "/images/summit_lounge.png" },
  { name: "Muro", location: "Museum Road", desc: "An alfresco section with lush foliage, Thai and Cantonese flavors.", img: "/images/gilded_rail.png" },
  { name: "YAZU", location: "St Mark’s Road", desc: "Pan-Asian supper club with a spectacular rooftop space and high spirits.", img: "/images/lupa_bengaluru.png" },
  { name: "Monkey Bar", location: "Church Street", desc: "Favourite gastropub with a lovely outdoor deck serving signature appetizers.", img: "/images/thirteenth_floor.png" },
  { name: "Airlines Hotel", location: "Lavelle Road", desc: "The original drive-in restaurant under massive banyan trees serving South Indian staples.", img: "/images/glass_conservatory.png" },
  { name: "Loya", location: "Taj West End", desc: "Himalayan foothill cuisine in the breezy outdoors.", img: "/images/nexus_hub.png" },
  { name: "Spice Terrace", location: "JW Marriott", desc: "Poolside views of UB City with chic furniture and pretty cabanas.", img: "/images/petal_yeast.png" },
  { name: "Suzy Q", location: "Cunningham Road", desc: "Stylish bar with a leafy outdoor space and vibrant global food.", img: "/images/summit_lounge.png" },
  { name: "The Craftery BLR", location: "Koramangala", desc: "Spacious open-air courtyard shaded by majestic ficus trees.", img: "/images/gilded_rail.png" },
  { name: "The Bier Library", location: "Koramangala", desc: "Central courtyard with open-air seating around a koi pond.", img: "/images/lupa_bengaluru.png" },
  { name: "Seta Restaurant", location: "Domlur", desc: "Poolside alfresco dining serving Mediterranean-Asian cuisine.", img: "/images/thirteenth_floor.png" },
  { name: "Zen", location: "The Leela Palace", desc: "Pan-Asian cuisine overlooking lush greenery with gentle lantern flickers.", img: "/images/glass_conservatory.png" },
  { name: "Jollygunj", location: "Yelahanka", desc: "Massive terrace restaurant with Kolkata-inspired cuisine under a twinkling sky.", img: "/images/nexus_hub.png" },
  { name: "The French Treaty", location: "Yelahanka", desc: "Set on an old mango plantation, bringing French flair with pasta and pizzettes.", img: "/images/petal_yeast.png" },
  { name: "Grover Vineyards", location: "Doddaballapura", desc: "Sip fine wines in garden lawns lined by koi ponds at the Nandi foothills.", img: "/images/summit_lounge.png" },
  { name: "Layla", location: "Whitefield", desc: "Indian-Terranean flavors on a stunning rooftop.", img: "/images/gilded_rail.png" },
  { name: "Mannheim Craft Brewery", location: "Whitefield", desc: "Open plan with lush landscaping and towering mango trees.", img: "/images/lupa_bengaluru.png" },
  { name: "Kaavu", location: "Brookefield", desc: "Alfresco dining surrounded by trees, serene water bodies and mini forests.", img: "/images/thirteenth_floor.png" },
  { name: "Oasis Brewery", location: "Whitefield", desc: "Bengaluru’s largest brewery landscaped around old trees and koi ponds.", img: "/images/glass_conservatory.png" },
  { name: "Maize & Malt", location: "Krishnarajapuram", desc: "Large open spaces, multiple decks, and a rooftop island bar.", img: "/images/nexus_hub.png" }
];

const EditorsRecommendation = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page" style={{ paddingBottom: '60px', height: '100%', overflowY: 'auto' }}>
      <nav className="dash-nav">
        <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#333' }}>
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        <div className="dash-nav-logo">Editor&apos;s Recommendations</div>
        <div className="dash-nav-right">
          {/* Empty to balance flex */}
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 24px 40px' }}>
        <div className="dash-picks-header" style={{ justifyContent: 'flex-start', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '28px' }}>The 25 Best Outdoor Restaurants in Bengaluru</h2>
        </div>
        <div className="dash-picks-underline" style={{ margin: '0 0 16px 0' }} />
        <p className="dash-picks-sub" style={{ textAlign: 'left', marginBottom: '40px' }}>The Garden City offers a wide variety, from scenic rooftops and massive breweries to green lawns and sprawling courtyards.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {recommendations.map((item, index) => (
            <div key={index} className="dash-card dash-card-large" style={{ gridColumn: 'span 1', height: '350px' }}>
              <img src={item.img} alt={item.name} />
              <div className="dash-card-overlay">
                <div className="dash-card-title">{item.name}</div>
                <div className="dash-card-desc" style={{ marginBottom: '4px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.location}</div>
                <div className="dash-card-desc">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditorsRecommendation;
