import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1>AssetFreelance Dashboard</h1>
          <p style={{ color: "var(--text-secondary)" }}>営業活動と案件状況の全体ビュー</p>
        </div>
        <div className={styles.actions}>
          <Link href="/applications/new" className="btn-primary">
            + 新規応募を作成
          </Link>
        </div>
      </header>

      <div className={styles.grid}>
        {/* KPI Summary Cards */}
        <div className={`glass-panel ${styles.kpiCard}`}>
          <h3>今月の応募数</h3>
          <div className={styles.kpiValue}>24件</div>
          <div className={styles.kpiTrend} data-trend="up">+15% vs 先月</div>
        </div>
        <div className={`glass-panel ${styles.kpiCard}`}>
          <h3>成約率</h3>
          <div className={styles.kpiValue}>18.5%</div>
          <div className={styles.kpiTrend} data-trend="up">+2.1% vs 先月</div>
        </div>
        <div className={`glass-panel ${styles.kpiCard}`}>
          <h3>アップセル提案候補</h3>
          <div className={styles.kpiValue} style={{ color: "var(--accent-color)" }}>3件</div>
          <div className={styles.kpiDesc}>今週完了予定の案件があります</div>
        </div>

        {/* Recent Applications (CRM) */}
        <div className={`glass-panel ${styles.mainPanel}`}>
          <div className={styles.panelHeader}>
            <h3>直近の応募状況</h3>
            <Link href="/applications" className="btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>一覧を見る</Link>
          </div>
          <div className={styles.list}>
            <div className={styles.listItem}>
              <div className={styles.itemMeta}>
                <span className={styles.tag}>CrowdWorks</span>
                <h4>React SP開発案件</h4>
              </div>
              <span className={styles.status} data-status="pending">返信待ち（3日経過）</span>
              <button className="btn-primary" style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}>追撃メールをAI生成</button>
            </div>
            <div className={styles.listItem}>
              <div className={styles.itemMeta}>
                <span className={styles.tag}>直営業</span>
                <h4>コーポレートサイトリニューアル</h4>
              </div>
              <span className={styles.status} data-status="active">商談中</span>
            </div>
          </div>
        </div>

        {/* Active Projects & Upsell Alerts */}
        <div className={`glass-panel ${styles.subPanel}`}>
          <h3>進行中プロジェクトとアクション</h3>
          <div className={styles.alertList}>
            <div className={styles.alertItem}>
              <div className={styles.alertIcon}>🔔</div>
              <div>
                <strong>A社 ECサイト改修</strong>
                <p>納品予定日まであと2日。継続開発の打診タイミングです。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
