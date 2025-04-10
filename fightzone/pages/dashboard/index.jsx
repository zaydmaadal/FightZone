"use client";

import { useAuth } from "../services/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Layout from "../../components/Layout";
import VechterDashboard from "../../components/dashboards/VechterDashboard";
import TrainerDashboard from "../../components/dashboards/TrainerDashboard";
import VKBMODashboard from "../../components/dashboards/VKBMODashboard";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="dashboard-container">
        <h1>Welkom, {user.name}</h1>
        {user.role === "Vechter" && <VechterDashboard />}
        {user.role === "Trainer" && <TrainerDashboard />}
        {user.role === "VKBMO-lid" && <VKBMODashboard />}
      </div>

      <style jsx>{`
        .dashboard-container {
          padding: 20px;
        }

        h1 {
          margin-bottom: 20px;
          color: #333;
          font-size: 24px;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-size: 18px;
          color: #666;
        }
      `}</style>
    </Layout>
  );
}
