"use client";

import Image from "next/image";
import { FormEvent, ReactNode, useMemo, useState } from "react";
import {
  collabHistory,
  creators,
  menuItems as initialMenuItems,
  restaurants,
  type MenuItem,
} from "@/lib/mock-data";

type Role = "restaurant" | "creator";
type RestaurantTab = "menu" | "creators" | "profile";
type CreatorTab = "restaurants" | "profile";

const icons: Record<string, ReactNode> = {
  menu: <><path d="M4 6h16M4 12h16M4 18h10" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  store: <><path d="M3 9l1-5h16l1 5" /><path d="M5 13v8h14v-8M9 21v-6h6v6" /><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  back: <><path d="M19 12H5M11 18l-6-6 6-6" /></>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".5" fill="currentColor" /></>,
  map: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  sparkles: <><path d="M12 3l1.4 3.6L17 8l-3.6 1.4L12 13l-1.4-3.6L7 8l3.6-1.4L12 3ZM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15ZM5 13l.8 2.2L8 16l-2.2.8L5 19l-.8-2.2L2 16l2.2-.8L5 13Z" /></>,
  camera: <><path d="M14.5 4 16 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3l1.5-3h5Z" /><circle cx="12" cy="13" r="3.5" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></>,
  logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /></>,
  message: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  trend: <><path d="m3 17 6-6 4 4 8-8" /><path d="M15 7h6v6" /></>,
  star: <path d="m12 2 3 6.5 7 .8-5.2 4.8 1.4 6.9-6.2-3.5L5.8 21l1.4-6.9L2 9.3l7-.8Z" />,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" /></>,
};

function Icon({ name, size = 20, className = "" }: { name: string; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="logo-wrap">
      <span className="logo-mark">K</span>
      {!compact && <span className="logo-type">KUZI</span>}
    </div>
  );
}

function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  return <button className={`button button-${variant} ${className}`} {...props}>{children}</button>;
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...props} />
    </label>
  );
}

function SelectField({ label, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select {...props}>{children}</select>
    </label>
  );
}

function InstagramConnect({ connected, onConnect }: { connected: boolean; onConnect: () => void }) {
  return connected ? (
    <div className="connected-card">
      <div className="ig-icon"><Icon name="instagram" /></div>
      <div><strong>@kuzi.community</strong><span>Instagram connected</span></div>
      <span className="connected-pill"><Icon name="check" size={14} /> Connected</span>
    </div>
  ) : (
    <Button type="button" className="ig-button" onClick={onConnect}>
      <Icon name="instagram" /> Connect Instagram
    </Button>
  );
}

function Welcome({ onSelect }: { onSelect: (role: Role) => void }) {
  return (
    <main className="welcome">
      <div className="welcome-panel">
        <header><Logo /><span className="eyebrow">Good food deserves to be seen</span></header>
        <div className="welcome-copy">
          <div className="mini-pill"><Icon name="sparkles" size={16} /> Local collaborations, made easy</div>
          <h1>Great food.<br /><em>Fresh stories.</em></h1>
          <p>KUZI connects local restaurants with creators who know how to make every plate look irresistible.</p>
          <div className="role-grid">
            <button className="role-card restaurant-role" onClick={() => onSelect("restaurant")}>
              <span className="role-art"><Icon name="store" size={34} /></span>
              <span><strong>I&apos;m a Restaurant</strong><small>Build your menu & grow your reach</small></span>
              <Icon name="arrow" />
            </button>
            <button className="role-card creator-role" onClick={() => onSelect("creator")}>
              <span className="role-art"><Icon name="camera" size={34} /></span>
              <span><strong>I&apos;m a Creator</strong><small>Discover places worth sharing</small></span>
              <Icon name="arrow" />
            </button>
          </div>
        </div>
        <footer>Ahmedabad&apos;s creator community, at your table.</footer>
      </div>
      <div className="welcome-photo">
        <div className="floating-note note-one"><span>Fresh collaboration</span><strong>Riya × The Pepper Mill</strong></div>
        <div className="floating-note note-two"><span className="avatar-stack">
          {creators.map((c) => <Image key={c.id} src={c.image} width={32} height={32} alt="" />)}
        </span><strong>50+ local creators</strong></div>
      </div>
    </main>
  );
}

function Onboarding({ role, onBack, onDone }: { role: Role; onBack: () => void; onDone: () => void }) {
  const [step, setStep] = useState(1);
  const [connected, setConnected] = useState(false);
  const [languages, setLanguages] = useState(["Gujarati", "English"]);
  const total = 3;
  const next = () => step < total ? setStep(step + 1) : onDone();
  const toggleLanguage = (language: string) => setLanguages((current) => current.includes(language) ? current.filter((item) => item !== language) : [...current, language]);

  return (
    <main className="onboarding">
      <aside className={`onboarding-art ${role}`}>
        <Logo />
        <div>
          <span className="eyebrow">{role === "restaurant" ? "For restaurants" : "For creators"}</span>
          <h2>{role === "restaurant" ? "Your next regular is scrolling right now." : "Your next favourite spot is around the corner."}</h2>
          <p>{role === "restaurant" ? "Put your best dishes in front of people who are ready to discover them." : "Create locally, build lasting partnerships, and tell stories your audience will love."}</p>
        </div>
        <div className="quote-card">“The best collaborations feel less like ads and more like sharing a great find.”</div>
      </aside>
      <section className="onboarding-form">
        <div className="form-top">
          <button className="icon-button" onClick={step === 1 ? onBack : () => setStep(step - 1)}><Icon name="back" /></button>
          <span>Step {step} of {total}</span>
        </div>
        <div className="progress"><span style={{ width: `${(step / total) * 100}%` }} /></div>
        <div className="form-content">
          {role === "restaurant" ? (
            <>
              {step === 1 && <div className="step-content">
                <span className="step-icon"><Icon name="store" size={28} /></span>
                <h2>Tell us about your restaurant</h2>
                <p>This helps us find creators and food lovers nearby.</p>
                <Field label="Restaurant name" placeholder="e.g. The Pepper Mill" defaultValue="The Pepper Mill" />
                <div className="field-row">
                  <Field label="City" placeholder="Ahmedabad" defaultValue="Ahmedabad" />
                  <SelectField label="Cuisine type" defaultValue="Modern Indian"><option>Modern Indian</option><option>Gujarati</option><option>Café & Bakery</option><option>South Indian</option></SelectField>
                </div>
              </div>}
              {step === 2 && <div className="step-content">
                <span className="step-icon"><Icon name="menu" size={28} /></span>
                <h2>Add your first dish</h2>
                <p>A great menu helps creators imagine what they can make with you.</p>
                <label className="photo-drop"><Icon name="camera" size={28} /><strong>Add a dish photo</strong><small>JPG or PNG, up to 10MB</small><input type="file" accept="image/*" /></label>
                <div className="field-row"><Field label="Item name" placeholder="Smoked Paneer Tikka" /><Field label="Price" placeholder="₹ 320" /></div>
                <SelectField label="Category"><option>Starters</option><option>Mains</option><option>Desserts</option><option>Drinks</option></SelectField>
              </div>}
              {step === 3 && <div className="step-content">
                <span className="step-icon instagram-gradient"><Icon name="instagram" size={28} /></span>
                <h2>Bring your Instagram along</h2>
                <p>Connect to show creators your audience and keep your profile current.</p>
                <InstagramConnect connected={connected} onConnect={() => setConnected(true)} />
                {connected && <div className="mock-stats"><div><strong>8.2K</strong><span>Followers</span></div><div><strong>34K</strong><span>Monthly reach</span></div><div><strong>4.8%</strong><span>Engagement</span></div></div>}
                <small className="secure-note">We only read public profile insights. You stay in control.</small>
              </div>}
            </>
          ) : (
            <>
              {step === 1 && <div className="step-content">
                <span className="step-icon"><Icon name="user" size={28} /></span>
                <h2>Let&apos;s set up your profile</h2>
                <p>Restaurants will use this to get to know your style.</p>
                <Field label="Your name" placeholder="e.g. Riya Shah" defaultValue="Riya Shah" />
                <Field label="City" placeholder="Ahmedabad" defaultValue="Ahmedabad" />
                <InstagramConnect connected={connected} onConnect={() => setConnected(true)} />
              </div>}
              {step === 2 && <div className="step-content">
                <span className="step-icon"><Icon name="message" size={28} /></span>
                <h2>What languages do you create in?</h2>
                <p>Pick all that apply. This helps restaurants find the right voice.</p>
                <div className="language-list">
                  {["Gujarati", "Hindi", "English"].map((language) => <button key={language} onClick={() => toggleLanguage(language)} className={languages.includes(language) ? "selected" : ""}><span>{language === "Gujarati" ? "અ" : language === "Hindi" ? "अ" : "A"}</span><strong>{language}</strong>{languages.includes(language) && <Icon name="check" />}</button>)}
                </div>
              </div>}
              {step === 3 && <div className="step-content complete-step">
                <div className="success-rings"><Icon name="check" size={42} /></div>
                <h2>You&apos;re ready to create.</h2>
                <p>Your profile is live. Explore local restaurants and find your next delicious collaboration.</p>
                <div className="profile-preview">
                  <Image src={creators[0].image} width={64} height={64} alt="Riya Shah" />
                  <div><strong>Riya Shah</strong><span>@riyabites · 24K followers</span><small>Food & Lifestyle · Ahmedabad</small></div>
                </div>
              </div>}
            </>
          )}
          <div className="form-actions">
            {role === "restaurant" && step === 2 && <button className="skip" onClick={next}>Skip for now, add later</button>}
            <Button onClick={next}>{step === total ? (role === "restaurant" ? "Go to my menu" : "Explore restaurants") : "Continue"} <Icon name="arrow" /></Button>
          </div>
        </div>
      </section>
    </main>
  );
}

const restaurantTabs = [
  { id: "menu", label: "Menu", icon: "menu" },
  { id: "creators", label: "Creators", icon: "users" },
  { id: "profile", label: "Profile", icon: "user" },
] as const;
const creatorTabs = [
  { id: "restaurants", label: "Restaurants", icon: "store" },
  { id: "profile", label: "Profile", icon: "user" },
] as const;

function Shell({ role, tab, setTab, children, onSignOut }: { role: Role; tab: string; setTab: (tab: never) => void; children: ReactNode; onSignOut: () => void }) {
  const tabs = role === "restaurant" ? restaurantTabs : creatorTabs;
  return (
    <div className="app-shell">
      <header className="desktop-header">
        <Logo />
        <nav>{tabs.map((item) => <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id as never)}><Icon name={item.icon} />{item.label}</button>)}</nav>
        <div className="header-actions"><button className="icon-button"><Icon name="bell" /></button><button className="mini-profile" onClick={() => setTab("profile" as never)}><span>{role === "restaurant" ? "TP" : "RS"}</span><div><strong>{role === "restaurant" ? "The Pepper Mill" : "Riya Shah"}</strong><small>{role === "restaurant" ? "Restaurant" : "Creator"}</small></div></button></div>
      </header>
      <main className="app-main">{children}</main>
      <nav className="mobile-tabs">{tabs.map((item) => <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id as never)}><Icon name={item.icon} /><span>{item.label}</span></button>)}</nav>
      <span className="sr-only"><button onClick={onSignOut}>Sign out</button></span>
    </div>
  );
}

function PageHeading({ eyebrow, title, body, action }: { eyebrow: string; title: string; body: string; action?: ReactNode }) {
  return <div className="page-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{body}</p></div>{action}</div>;
}

function MenuPage({ items, onAdd }: { items: MenuItem[]; onAdd: () => void }) {
  const [category, setCategory] = useState("All");
  const filtered = category === "All" ? items : items.filter((item) => item.category === category);
  const categories = ["All", ...Array.from(new Set(items.map((item) => item.category)))];
  return (
    <>
      <PageHeading eyebrow="Your digital menu" title="What’s cooking?" body="Keep your best dishes fresh and easy to discover." action={<Button onClick={onAdd}><Icon name="plus" /> Add item</Button>} />
      {items.length ? <>
        <div className="filter-row">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}<span>{filtered.length} dishes</span></div>
        <div className="menu-grid">{filtered.map((item) => <article className="menu-card" key={item.id}>
          <div className="image-wrap"><Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 50vw, 25vw" /><button className="edit-float"><Icon name="edit" size={16} /></button><span className="category-label">{item.category}</span></div>
          <div><h3>{item.name}</h3><p>{item.description}</p><strong>₹{item.price}</strong></div>
        </article>)}</div>
      </> : <div className="empty-state"><div className="empty-art"><Icon name="menu" size={48} /></div><h2>Your menu is waiting to shine</h2><p>Add your first dish and help creators discover what makes your kitchen special.</p><Button onClick={onAdd}><Icon name="plus" /> Add your first item</Button></div>}
      <button className="fab" onClick={onAdd}><Icon name="plus" /><span>Add item</span></button>
    </>
  );
}

function MatchCard({ perspective, onComplete }: { perspective: Role; onComplete: () => void }) {
  const creatorPerspective = perspective === "creator";
  return (
    <article className="match-card">
      <div className="match-banner"><Icon name="sparkles" size={16} /> YOUR CURRENT MATCH <span>12 days left</span></div>
      <div className="match-body">
        <div className="match-person">
          <Image src={creatorPerspective ? restaurants[0].cover : creators[0].image} width={86} height={86} alt="" />
          <div><span className="mini-pill">Matched for September</span><h2>{creatorPerspective ? restaurants[0].name : creators[0].name}</h2><p>{creatorPerspective ? "Modern Indian · Bodakdev" : "@riyabites · 24K followers · Food & Lifestyle"}</p></div>
        </div>
        <div className="match-actions"><Button><Icon name="message" /> Say hello</Button><Button variant="secondary" onClick={onComplete}><Icon name="check" /> Mark complete</Button></div>
      </div>
    </article>
  );
}

function CreatorsPage() {
  const [subscribed, setSubscribed] = useState(false);
  const [pricing, setPricing] = useState(false);
  const [rating, setRating] = useState(false);
  return (
    <>
      <PageHeading eyebrow="Local creator network" title="Creators near you" body="Food storytellers in Ahmedabad, ready to make something memorable." />
      {!subscribed ? <div className="subscribe-banner">
        <div className="subscribe-icon"><Icon name="sparkles" size={28} /></div>
        <div><span>FRESH CONTENT, ON REPEAT</span><h2>Meet your next creative partner.</h2><p>Subscribe and we&apos;ll match you with the right local creator every 15 or 30 days.</p></div>
        <Button onClick={() => setPricing(true)}>See plans <Icon name="arrow" /></Button>
      </div> : <MatchCard perspective="restaurant" onComplete={() => setRating(true)} />}
      <div className="section-title"><div><h2>Discover Ahmedabad creators</h2><p><Icon name="map" size={16} /> Showing creators in your city</p></div><span>{creators.length} creators</span></div>
      <div className="creator-grid">{creators.map((creator) => <article className="creator-card" key={creator.id}>
        <div className="creator-head"><Image src={creator.image} width={58} height={58} alt={creator.name} /><div><h3>{creator.name}</h3><span>{creator.handle}</span></div><div className="follower-count"><strong>{creator.followers}</strong><span>followers</span></div></div>
        <span className="niche"><Icon name="sparkles" size={13} /> {creator.niche}</span>
        <div className="post-grid">{creator.posts.map((post, index) => <div key={post}><Image src={post} alt={`${creator.name} sample post ${index + 1}`} fill sizes="(max-width: 768px) 33vw, 12vw" /></div>)}</div>
        <button className="view-profile">View profile <Icon name="arrow" size={17} /></button>
      </article>)}</div>
      {pricing && <PricingModal onClose={() => setPricing(false)} onSubscribe={() => { setSubscribed(true); setPricing(false); }} />}
      {rating && <RatingModal name={creators[0].name} onClose={() => setRating(false)} />}
    </>
  );
}

function PricingModal({ onClose, onSubscribe }: { onClose: () => void; onSubscribe: () => void }) {
  const [cadence, setCadence] = useState<"monthly" | "fortnightly">("monthly");
  const plans = [
    { name: "Budding", range: "5K–15K followers", price: 4999, note: "Build a steady local presence" },
    { name: "Established", range: "15K–50K followers", price: 8999, note: "Our most popular growth plan", popular: true },
    { name: "Famous", range: "50K+ followers", price: 14999, note: "Make a bigger city-wide splash" },
  ];
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal pricing-modal" onMouseDown={(e) => e.stopPropagation()}>
    <button className="modal-close" onClick={onClose}><Icon name="close" /></button>
    <span className="eyebrow">Simple, transparent plans</span><h2>Fresh content, right on schedule.</h2><p>Choose the reach and rhythm that works for your restaurant.</p>
    <div className="cadence"><button className={cadence === "monthly" ? "active" : ""} onClick={() => setCadence("monthly")}>Every month</button><button className={cadence === "fortnightly" ? "active" : ""} onClick={() => setCadence("fortnightly")}>Every 15 days <span>Best value</span></button></div>
    <div className="plans">{plans.map((plan) => <article key={plan.name} className={plan.popular ? "popular" : ""}>{plan.popular && <span className="popular-tag">MOST LOVED</span>}<h3>{plan.name}</h3><p>{plan.range}</p><strong>₹{(plan.price * (cadence === "fortnightly" ? 1.7 : 1)).toLocaleString("en-IN")}<small>/mo</small></strong><span>{plan.note}</span><ul><li><Icon name="check" size={15} /> Curated creator match</li><li><Icon name="check" size={15} /> Direct collaboration chat</li><li><Icon name="check" size={15} /> Flexible scheduling</li></ul><Button variant={plan.popular ? "primary" : "secondary"} onClick={onSubscribe}>Choose {plan.name}</Button></article>)}</div>
    <small className="pricing-note">No creator fees shown. Pause or change your plan anytime.</small>
  </div></div>;
}

function RatingModal({ name, onClose }: { name: string; onClose: () => void }) {
  const [stars, setStars] = useState(0);
  const [done, setDone] = useState(false);
  return <div className="modal-backdrop"><div className="modal rating-modal">
    {done ? <><div className="success-rings"><Icon name="check" size={38} /></div><h2>Collab complete!</h2><p>Thanks for sharing. Your next match is already on its way.</p><Button onClick={onClose}>Done</Button></> : <><span className="step-icon"><Icon name="sparkles" /></span><h2>How was your collab?</h2><p>Your rating for {name} helps make every match better.</p><div className="stars">{[1,2,3,4,5].map((star) => <button key={star} onClick={() => setStars(star)} className={star <= stars ? "active" : ""}><Icon name="star" size={32} /></button>)}</div><textarea placeholder="Share a quick note (optional)" /><div className="rating-actions"><Button variant="ghost" onClick={onClose}>Not now</Button><Button disabled={!stars} onClick={() => setDone(true)}>Submit rating</Button></div></>}
  </div></div>;
}

function RestaurantsPage({ notify }: { notify: (message: string) => void }) {
  const [rating, setRating] = useState(false);
  const [requested, setRequested] = useState<number[]>([]);
  const request = (id: number) => { setRequested((current) => [...current, id]); notify("Request sent — priority noted"); };
  return <>
    <PageHeading eyebrow="Explore your city" title="Restaurants worth sharing" body="Fresh spots and local favourites in Ahmedabad." />
    <MatchCard perspective="creator" onComplete={() => setRating(true)} />
    <div className="section-title"><div><h2>Discover nearby</h2><p><Icon name="map" size={16} /> Ahmedabad restaurants</p></div><span>{restaurants.length} places</span></div>
    <div className="restaurant-grid">{restaurants.map((restaurant) => <article className="restaurant-card" key={restaurant.id}>
      <div className="restaurant-cover"><Image src={restaurant.cover} alt={restaurant.name} fill sizes="(max-width: 768px) 100vw, 33vw" /><span>{restaurant.cuisine}</span></div>
      <div className="restaurant-info"><div><h3>{restaurant.name}</h3><p><Icon name="map" size={14} /> {restaurant.area}, Ahmedabad</p></div><div className="dish-peeks">{restaurant.dishes.map((dish) => <Image key={dish} src={dish} width={42} height={42} alt="" />)}</div></div>
      <Button variant="secondary" disabled={requested.includes(restaurant.id)} onClick={() => request(restaurant.id)}>{requested.includes(restaurant.id) ? <><Icon name="check" /> Request sent</> : <>Request this restaurant <Icon name="arrow" /></>}</Button>
    </article>)}</div>
    {rating && <RatingModal name={restaurants[0].name} onClose={() => setRating(false)} />}
  </>;
}

function StatCard({ icon, label, value, change }: { icon: string; label: string; value: string; change?: string }) {
  return <div className="stat-card"><span><Icon name={icon} /></span><div><small>{label}</small><strong>{value}</strong>{change && <em>{change}</em>}</div></div>;
}

function ProfilePage({ role, onSignOut }: { role: Role; onSignOut: () => void }) {
  const restaurant = role === "restaurant";
  return <>
    <PageHeading eyebrow="Your space" title="Profile" body="Keep your details fresh and see how your presence is growing." />
    <div className="profile-layout">
      <div className="profile-main">
        <section className="profile-card identity-card">
          <div className="profile-cover"></div>
          <div className="identity">
            <div className="large-avatar">{restaurant ? "TP" : <Image src={creators[0].image} fill alt="Riya Shah" sizes="96px" />}</div>
            <div><h2>{restaurant ? "The Pepper Mill" : "Riya Shah"}</h2><p>{restaurant ? "Modern Indian · Bodakdev, Ahmedabad" : "@riyabites · Food & Lifestyle"}</p><span className="verified"><Icon name="check" size={12} /> Profile complete</span></div>
            <Button variant="secondary"><Icon name="edit" size={16} /> Edit details</Button>
          </div>
        </section>
        <section className="profile-card">
          <div className="card-title"><div><span className="ig-icon"><Icon name="instagram" /></span><div><h3>Instagram insights</h3><p>@{restaurant ? "thepeppermill.ahd" : "riyabites"} · Connected</p></div></div><span className="connected-pill"><Icon name="check" size={13} /> Live</span></div>
          <div className="stats-row"><StatCard icon="users" label="Followers" value={restaurant ? "8.2K" : "24.3K"} change="+4.2%" /><StatCard icon="trend" label="Monthly reach" value={restaurant ? "34K" : "112K"} change="+12%" /><StatCard icon="sparkles" label="Engagement" value={restaurant ? "4.8%" : "5.6%"} /></div>
        </section>
        {!restaurant && <section className="profile-card">
          <div className="card-title"><div><span className="plain-icon"><Icon name="message" /></span><div><h3>Languages</h3><p>Languages you create content in</p></div></div><Button variant="ghost"><Icon name="edit" size={16} /> Edit</Button></div>
          <div className="language-chips"><span>અ Gujarati</span><span>अ Hindi</span><span>A English</span></div>
        </section>}
        {!restaurant && <section className="profile-card">
          <div className="card-title"><div><span className="plain-icon"><Icon name="calendar" /></span><div><h3>Collaboration history</h3><p>Your recent partnerships</p></div></div></div>
          <div className="history-list">{collabHistory.map((item) => <div key={item.restaurant}><span className="history-logo">{item.restaurant[0]}</span><div><strong>{item.restaurant}</strong><small>{item.date}</small></div><span><strong>{item.engagement}</strong><small>engagements</small></span></div>)}</div>
        </section>}
      </div>
      <aside className="profile-side">
        {restaurant && <section className="subscription-card"><span className="eyebrow">Your subscription</span><div className="plan-row"><div><small>ESTABLISHED</small><strong>Monthly match</strong></div><span>Active</span></div><hr /><div className="next-match"><Icon name="calendar" /><div><small>Next match</small><strong>October 1, 2026</strong></div></div><Button variant="secondary">Manage plan <Icon name="chevron" size={16} /></Button></section>}
        <section className="profile-card account-card"><h3>Account</h3><button><Icon name="message" /> Help & support <Icon name="chevron" /></button><button onClick={onSignOut} className="sign-out"><Icon name="logout" /> Sign out <Icon name="chevron" /></button></section>
      </aside>
    </div>
  </>;
}

function AddItemModal({ onClose, onAdd }: { onClose: () => void; onAdd: (item: MenuItem) => void }) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onAdd({
      id: Date.now(),
      name: String(data.get("name") || "New dish"),
      price: Number(data.get("price")) || 280,
      category: String(data.get("category")),
      description: String(data.get("description") || "A delicious new addition to our menu"),
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=85",
    });
  };
  return <div className="modal-backdrop" onMouseDown={onClose}><form className="modal add-modal" onSubmit={submit} onMouseDown={(e) => e.stopPropagation()}>
    <button type="button" className="modal-close" onClick={onClose}><Icon name="close" /></button><span className="eyebrow">Your menu</span><h2>Add a new dish</h2><p>Show it at its most delicious.</p>
    <label className="photo-drop compact"><Icon name="camera" size={26} /><strong>Upload a photo</strong><small>Bright, natural photos work best</small><input type="file" accept="image/*" /></label>
    <div className="field-row"><Field required name="name" label="Dish name" placeholder="e.g. Truffle Khichdi" /><Field required name="price" type="number" label="Price (₹)" placeholder="320" /></div>
    <SelectField name="category" label="Category"><option>Starters</option><option>Mains</option><option>Desserts</option><option>Drinks</option></SelectField>
    <label className="field"><span>Description</span><textarea name="description" placeholder="What makes this dish special?" /></label>
    <div className="modal-actions"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit">Add to menu <Icon name="arrow" /></Button></div>
  </form></div>;
}

function RestaurantApp({ onSignOut }: { onSignOut: () => void }) {
  const [tab, setTab] = useState<RestaurantTab>("menu");
  const [items, setItems] = useState(initialMenuItems);
  const [adding, setAdding] = useState(false);
  return <Shell role="restaurant" tab={tab} setTab={setTab as never} onSignOut={onSignOut}>
    {tab === "menu" && <MenuPage items={items} onAdd={() => setAdding(true)} />}
    {tab === "creators" && <CreatorsPage />}
    {tab === "profile" && <ProfilePage role="restaurant" onSignOut={onSignOut} />}
    {adding && <AddItemModal onClose={() => setAdding(false)} onAdd={(item) => { setItems([item, ...items]); setAdding(false); }} />}
  </Shell>;
}

function CreatorApp({ onSignOut }: { onSignOut: () => void }) {
  const [tab, setTab] = useState<CreatorTab>("restaurants");
  const [toast, setToast] = useState("");
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2800); };
  return <Shell role="creator" tab={tab} setTab={setTab as never} onSignOut={onSignOut}>
    {tab === "restaurants" && <RestaurantsPage notify={notify} />}
    {tab === "profile" && <ProfilePage role="creator" onSignOut={onSignOut} />}
    {toast && <div className="toast"><span><Icon name="check" /></span><div><strong>{toast}</strong><small>We&apos;ll keep this in mind for your next match.</small></div></div>}
  </Shell>;
}

export default function KuziApp() {
  const [role, setRole] = useState<Role | null>(null);
  const [onboarded, setOnboarded] = useState(false);
  const screen = useMemo(() => !role ? "welcome" : !onboarded ? "onboarding" : "app", [role, onboarded]);
  const reset = () => { setRole(null); setOnboarded(false); };
  if (screen === "welcome") return <Welcome onSelect={setRole} />;
  if (screen === "onboarding" && role) return <Onboarding role={role} onBack={reset} onDone={() => setOnboarded(true)} />;
  return role === "restaurant" ? <RestaurantApp onSignOut={reset} /> : <CreatorApp onSignOut={reset} />;
}
