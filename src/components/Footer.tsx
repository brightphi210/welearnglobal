import { FaGraduationCap } from "react-icons/fa";
import { FiFacebook, FiInstagram, FiLinkedin, FiTwitter } from "react-icons/fi";

const Footer = () => {
    const columns = [
        {
            heading: "Platform",
            links: ["Discover Tutors", "How it works", "Pricing", "Resources"],
        },
        {
            heading: "Support",
            links: ["Help Center", "Safety & Security", "Contact Us"],
        },
        {
            heading: "Join Us",
            links: [],
            cta: true,
        },
    ];

    const socials = [
        { icon: <FiTwitter size={16} />, href: "#" },
        { icon: <FiInstagram size={16} />, href: "#" },
        { icon: <FiLinkedin size={16} />, href: "#" },
        { icon: <FiFacebook size={16} />, href: "#" },
    ];

    return (
        <footer
            style={{
                backgroundColor: "#ffffff",
                borderTop: "1px solid #e8f5f0",
                fontFamily: "'Inter', sans-serif",
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "60px 24px 32px",
                }}
            >
                {/* Top grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr 1fr",
                        gap: "40px",
                        marginBottom: "48px",
                    }}
                    className="footer-grid"
                >
                    {/* Brand column */}
                    <div>
                        <a
                            href="#"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                textDecoration: "none",
                                marginBottom: "14px",
                            }}
                        >
                            <div
                                style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "8px",
                                    background: "linear-gradient(135deg, #10b981, #059669)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <FaGraduationCap size={17} color="#fff" />
                            </div>
                            <span
                                style={{
                                    fontWeight: 700,
                                    fontSize: "15px",
                                    color: "#111827",
                                }}
                            >
                                WeLearnGlobal
                            </span>
                        </a>
                        <p
                            style={{
                                fontSize: "13px",
                                color: "#6b7280",
                                lineHeight: 1.65,
                                margin: "0 0 20px",
                                maxWidth: "200px",
                            }}
                        >
                            Connecting students and verified tutors globally to foster a
                            community of lifelong learning.
                        </p>
                        {/* Socials */}
                        <div style={{ display: "flex", gap: "10px" }}>
                            {socials.map((s, i) => (
                                <a
                                    key={i}
                                    href={s.href}
                                    style={{
                                        width: "34px",
                                        height: "34px",
                                        borderRadius: "8px",
                                        border: "1px solid #e5e7eb",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#6b7280",
                                        textDecoration: "none",
                                        transition: "all 0.2s",
                                    }}
                                    onMouseEnter={(e) => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.borderColor = "#10b981";
                                        el.style.color = "#10b981";
                                        el.style.backgroundColor = "#f0fdf4";
                                    }}
                                    onMouseLeave={(e) => {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.borderColor = "#e5e7eb";
                                        el.style.color = "#6b7280";
                                        el.style.backgroundColor = "transparent";
                                    }}
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {columns.map((col) => (
                        <div key={col.heading}>
                            <h4
                                style={{
                                    fontSize: "13px",
                                    fontWeight: 700,
                                    color: "#111827",
                                    marginBottom: "16px",
                                    letterSpacing: "0.05em",
                                    textTransform: "uppercase",
                                }}
                            >
                                {col.heading}
                            </h4>
                            {col.cta ? (
                                <div>
                                    <p
                                        style={{
                                            fontSize: "13px",
                                            color: "#6b7280",
                                            marginBottom: "14px",
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        Become a verified tutor today.
                                    </p>
                                    <a
                                        href="#"
                                        style={{
                                            display: "inline-block",
                                            padding: "9px 20px",
                                            borderRadius: "8px",
                                            border: "1.5px solid #111827",
                                            fontSize: "13px",
                                            fontWeight: 600,
                                            color: "#111827",
                                            textDecoration: "none",
                                            transition: "all 0.2s",
                                        }}
                                        onMouseEnter={(e) => {
                                            const el = e.currentTarget as HTMLElement;
                                            el.style.backgroundColor = "#111827";
                                            el.style.color = "#ffffff";
                                        }}
                                        onMouseLeave={(e) => {
                                            const el = e.currentTarget as HTMLElement;
                                            el.style.backgroundColor = "transparent";
                                            el.style.color = "#111827";
                                        }}
                                    >
                                        Apply Now
                                    </a>
                                </div>
                            ) : (
                                <ul
                                    style={{
                                        listStyle: "none",
                                        margin: 0,
                                        padding: 0,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "10px",
                                    }}
                                >
                                    {col.links.map((link) => (
                                        <li key={link}>
                                            <a
                                                href="#"
                                                style={{
                                                    fontSize: "14px",
                                                    color: "#6b7280",
                                                    textDecoration: "none",
                                                    transition: "color 0.2s",
                                                }}
                                                onMouseEnter={(e) =>
                                                    ((e.target as HTMLElement).style.color = "#10b981")
                                                }
                                                onMouseLeave={(e) =>
                                                    ((e.target as HTMLElement).style.color = "#6b7280")
                                                }
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div
                    style={{
                        borderTop: "1px solid #f3f4f6",
                        paddingTop: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "12px",
                    }}
                >
                    <span style={{ fontSize: "13px", color: "#9ca3af" }}>
                        © 2024 WeLearnGlobal. All rights reserved.
                    </span>
                    <div style={{ display: "flex", gap: "24px" }}>
                        {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                            (item) => (
                                <a
                                    key={item}
                                    href="#"
                                    style={{
                                        fontSize: "13px",
                                        color: "#9ca3af",
                                        textDecoration: "none",
                                        transition: "color 0.2s",
                                    }}
                                    onMouseEnter={(e) =>
                                        ((e.target as HTMLElement).style.color = "#374151")
                                    }
                                    onMouseLeave={(e) =>
                                        ((e.target as HTMLElement).style.color = "#9ca3af")
                                    }
                                >
                                    {item}
                                </a>
                            )
                        )}
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 540px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </footer>
    );
};

export default Footer;