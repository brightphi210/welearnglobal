import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hasToken, setHasToken] = useState(false);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("welearnToken");
            const storedRole = localStorage.getItem("welearnRole");
            setHasToken(!!token);
            setRole(storedRole);
        };

        checkAuth();

        // Keep in sync if auth changes in another tab, or via login/logout in this tab
        window.addEventListener("storage", checkAuth);
        window.addEventListener("welearnTokenChange", checkAuth);

        return () => {
            window.removeEventListener("storage", checkAuth);
            window.removeEventListener("welearnTokenChange", checkAuth);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    const navLinks = [
        { label: "How it works", href: "/how-it-works" },
        { label: "Contact", href: "/contact" },
        { label: "About", href: "/about" },
    ];

    const goToDashboard = () => {
        setIsOpen(false);
        if (role === "tutor") {
            navigate("/tutor/dashboard/overview");
        } else if (role === "student") {
            navigate("/student/dashboard/overview");
        } else {
            navigate("/dashboard");
        }
    };

    return (
        <>
            <nav
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    backgroundColor: scrolled ? "rgba(255,255,255,0.97)" : "#ffffff",
                    boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.08)" : "0 1px 0 #e8f5f0",
                    transition: "box-shadow 0.3s ease, background-color 0.3s ease",
                }}
            >
                <div
                    style={{
                        maxWidth: "1200px",
                        margin: "0 auto",
                        padding: "0 24px",
                        height: "64px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    {/* Logo */}
                    <Link
                        to="/"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            textDecoration: "none",
                            flexShrink: 0,
                        }}
                    >
                        <span
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 700,
                                fontSize: "16px",
                                color: "#111827",
                                letterSpacing: "-0.3px",
                            }}
                        >
                            WELEARN
                        </span>
                    </Link>

                    {/* Desktop nav links */}
                    <ul
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "36px",
                            listStyle: "none",
                            margin: 0,
                            padding: 0,
                        }}
                        className="desktop-nav"
                    >
                        {navLinks.map((link) => (
                            <li key={link.label}>
                                <Link
                                    to={link.href}
                                    style={{
                                        textDecoration: "none",
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        color: "#374151",
                                        transition: "color 0.2s",
                                    }}
                                    onMouseEnter={(e) =>
                                        ((e.target as HTMLElement).style.color = "#10b981")
                                    }
                                    onMouseLeave={(e) =>
                                        ((e.target as HTMLElement).style.color = "#374151")
                                    }
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Desktop CTA buttons */}
                    <div
                        style={{ display: "flex", alignItems: "center", gap: "12px" }}
                        className="desktop-nav"
                    >
                        {hasToken ? (
                            <button
                                onClick={goToDashboard}
                                style={{
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "#ffffff",
                                    backgroundColor: "#14532d",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: "9px 20px",
                                    borderRadius: "50px",
                                    transition: "background-color 0.2s, transform 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = "#166534";
                                    (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = "#14532d";
                                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                                }}
                            >
                                Dashboard
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    style={{
                                        textDecoration: "none",
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        color: "#374151",
                                        padding: "8px 16px",
                                        borderRadius: "50px",
                                        transition: "background 0.2s",
                                    }}
                                    onMouseEnter={(e) =>
                                        ((e.target as HTMLElement).style.background = "#f3f4f6")
                                    }
                                    onMouseLeave={(e) =>
                                        ((e.target as HTMLElement).style.background = "transparent")
                                    }
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/signup"
                                    style={{
                                        textDecoration: "none",
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        color: "#ffffff",
                                        backgroundColor: "#14532d",
                                        padding: "9px 20px",
                                        borderRadius: "8px",
                                        transition: "background-color 0.2s, transform 0.2s",
                                        display: "inline-block",
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.target as HTMLElement).style.backgroundColor = "#166534";
                                        (e.target as HTMLElement).style.transform = "translateY(-1px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.target as HTMLElement).style.backgroundColor = "#14532d";
                                        (e.target as HTMLElement).style.transform = "translateY(0)";
                                    }}
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Hamburger button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="hamburger-btn"
                        aria-label="Toggle menu"
                        style={{
                            display: "none",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "6px",
                            color: "#111827",
                            borderRadius: "6px",
                        }}
                    >
                        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu overlay */}
            <div
                onClick={() => setIsOpen(false)}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 998,
                    backgroundColor: "rgba(0,0,0,0.4)",
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? "all" : "none",
                    transition: "opacity 0.3s ease",
                }}
            />

            {/* Mobile slide-in drawer */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: "280px",
                    zIndex: 999,
                    backgroundColor: "#ffffff",
                    boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
                    transform: isOpen ? "translateX(0)" : "translateX(100%)",
                    transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                    display: "flex",
                    flexDirection: "column",
                    padding: "0",
                }}
                className="mobile-drawer"
            >
                {/* Drawer header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px 20px",
                        borderBottom: "1px solid #f3f4f6",
                    }}
                >
                    <span
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 700,
                            fontSize: "15px",
                            color: "#111827",
                        }}
                    >
                        WELEARN
                    </span>
                    <button
                        onClick={() => setIsOpen(false)}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#6b7280",
                            padding: "4px",
                        }}
                    >
                        <FiX size={22} />
                    </button>
                </div>

                {/* Drawer links */}
                <nav style={{ flex: 1, padding: "12px 0" }}>
                    {navLinks.map((link, i) => (
                        <Link
                            key={link.label}
                            to={link.href}
                            onClick={() => setIsOpen(false)}
                            style={{
                                display: "block",
                                padding: "14px 24px",
                                textDecoration: "none",
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "15px",
                                fontWeight: 500,
                                color: "#374151",
                                borderLeft: "3px solid transparent",
                                transition: "all 0.2s",
                                opacity: isOpen ? 1 : 0,
                                transform: isOpen ? "translateX(0)" : "translateX(20px)",
                                transitionDelay: isOpen ? `${i * 60 + 100}ms` : "0ms",
                            }}
                            onMouseEnter={(e) => {
                                const el = e.currentTarget as HTMLElement;
                                el.style.color = "#10b981";
                                el.style.borderLeftColor = "#10b981";
                                el.style.backgroundColor = "#f0fdf4";
                            }}
                            onMouseLeave={(e) => {
                                const el = e.currentTarget as HTMLElement;
                                el.style.color = "#374151";
                                el.style.borderLeftColor = "transparent";
                                el.style.backgroundColor = "transparent";
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div
                        style={{
                            padding: "20px 24px",
                            borderTop: "1px solid #f3f4f6",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            opacity: isOpen ? 1 : 0,
                            transform: isOpen ? "translateY(0)" : "translateY(10px)",
                            transition: "opacity 0.3s ease 0.3s, transform 0.3s ease 0.3s",
                        }}
                    >
                        {hasToken ? (
                            <button
                                onClick={goToDashboard}
                                style={{
                                    textAlign: "center",
                                    padding: "12px",
                                    borderRadius: "50px",
                                    border: "none",
                                    cursor: "pointer",
                                    backgroundColor: "#14532d",
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    color: "#ffffff",
                                }}
                            >
                                Dashboard
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    style={{
                                        textDecoration: "none",
                                        textAlign: "center",
                                        padding: "12px",
                                        borderRadius: "50px",
                                        border: "1.5px solid #e5e7eb",
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: "12px",
                                        fontWeight: 600,
                                        color: "#374151",
                                    }}
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={() => setIsOpen(false)}
                                    style={{
                                        textDecoration: "none",
                                        textAlign: "center",
                                        padding: "12px",
                                        borderRadius: "50px",
                                        backgroundColor: "#14532d",
                                        fontFamily: "'Inter', sans-serif",
                                        fontSize: "12px",
                                        fontWeight: 600,
                                        color: "#ffffff",
                                    }}
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .hamburger-btn {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>
        </>
    );
};

export default Navbar;