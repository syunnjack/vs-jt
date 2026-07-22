import { useMemo, useState } from 'react'

const Icon = ({ name, size = 22 }) => {
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    locate: <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/></>,
    list: <><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r=".5"/><circle cx="3.5" cy="12" r=".5"/><circle cx="3.5" cy="18" r=".5"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    route: <><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h2a4 4 0 0 0 4-4V9a4 4 0 0 1 4-4"/></>,
    close: <path d="m5 5 14 14M19 5 5 19"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    camera: <><path d="M4 7h3l2-3h6l2 3h3v13H4z"/><circle cx="12" cy="13" r="4"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
  }
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const spots = [
  { id: 1, name: '新宿駅西口 喫煙所', area: '西新宿1丁目', distance: 120, walk: 2, status: '空いてる', tone: 'free', updated: '2分前', x: 29, y: 41, type: '屋外', rating: 4.2, reports: 28 },
  { id: 2, name: 'NEWoMan 2F テラス', area: '新宿4丁目', distance: 280, walk: 4, status: 'ふつう', tone: 'normal', updated: '5分前', x: 68, y: 29, type: '屋外', rating: 4.5, reports: 42 },
  { id: 3, name: '西武新宿駅前スポット', area: '歌舞伎町1丁目', distance: 450, walk: 6, status: '混んでる', tone: 'busy', updated: '1分前', x: 53, y: 67, type: '屋内', rating: 3.8, reports: 19 },
  { id: 4, name: '新宿三丁目 東口広場', area: '新宿3丁目', distance: 620, walk: 8, status: '空いてる', tone: 'free', updated: '8分前', x: 79, y: 51, type: '屋外', rating: 4.0, reports: 31 },
]

function App() {
  const [view, setView] = useState('map')
  const [selected, setSelected] = useState(spots[0])
  const [sheet, setSheet] = useState('spot')
  const [toast, setToast] = useState('')
  const [filter, setFilter] = useState('すべて')
  const [points, setPoints] = useState(120)
  const [notified, setNotified] = useState(false)
  const visible = useMemo(() => spots.filter((spot) => filter === 'すべて' || spot.type === filter || (filter === '空いてる' && spot.tone === 'free')), [filter])

  const flash = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2400) }
  const report = (status) => {
    setSelected((spot) => ({ ...spot, status, tone: status === '空いてる' ? 'free' : status === 'ふつう' ? 'normal' : 'busy', updated: 'たった今' }))
    setPoints((value) => value + 5)
    setSheet('spot')
    flash('混雑状況を共有しました · +5 pt')
  }
  const enableNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') return flash('通知は端末の設定から許可できます')
    }
    setNotified(true); flash('近くが空いたらお知らせします')
  }

  return <div className="app-shell">
    <header className="topbar">
      <button className="logo" onClick={() => setView('map')} aria-label="マップへ"><span>ス</span>スグスウ</button>
      <div className="points"><small>MY POINTS</small><b>{points}<i>pt</i></b></div>
      <button className={`circle-button ${notified ? 'is-on' : ''}`} onClick={enableNotifications} aria-label="空き通知"><Icon name="bell" size={20}/></button>
    </header>
    <div className="zero-friction"><b>登録・アプリ不要</b><span>このまますぐ使えます</span></div>

    <main>
      <section className="map-stage" aria-label="新宿駅周辺の喫煙スポット地図">
        <div className="map-art" aria-hidden="true"><i className="road r1"/><i className="road r2"/><i className="road r3"/><i className="road r4"/><span className="station">新宿駅</span><span className="district d1">西新宿</span><span className="district d2">新宿三丁目</span><span className="district d3">歌舞伎町</span></div>
        <div className="search-row">
          <button className="search-box" onClick={() => flash('現在は新宿駅周辺を表示しています')}><Icon name="search" size={19}/><span>駅名・エリアで探す</span></button>
          <button className="locate-button" onClick={() => flash('現在地を更新しました')} aria-label="現在地"><Icon name="locate"/></button>
        </div>
        <div className="filters">{['すべて','空いてる','屋内','屋外'].map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div>
        {view === 'map' && visible.map((spot) => <button key={spot.id} className={`map-pin ${spot.tone} ${selected.id === spot.id ? 'selected' : ''}`} style={{left:`${spot.x}%`,top:`${spot.y}%`}} onClick={() => { setSelected(spot); setSheet('spot') }}><span>{spot.walk}<small>分</small></span></button>)}
        <div className="me-dot"><i/></div>
      </section>

      <section className={`bottom-sheet ${view === 'list' ? 'list-mode' : ''}`}>
        <div className="grabber" />
        {view === 'map' ? <>
          <div className="sheet-meta"><span className={`status ${selected.tone}`}><i/>{selected.status}</span><span>{selected.updated}の投稿</span><button aria-label="閉じる" onClick={() => setSelected(spots[0])}><Icon name="close" size={17}/></button></div>
          <div className="spot-title"><div><p>{selected.type} · 加熱式／紙巻き対応</p><h1>{selected.name}</h1><span>{selected.area} · 現在地から {selected.distance}m</span></div><b>{selected.walk}<small>min</small></b></div>
          <div className="rating"><strong>★ {selected.rating}</strong><span>みんなの投稿 {selected.reports}件</span><span className="trust">直近10分の情報</span></div>
          <div className="actions">
            <button className="route-button" onClick={() => flash('Google マップでルートを開きます')}><Icon name="route" size={20}/>ここへ行く</button>
            <button className="report-button" onClick={() => setSheet('report')}><Icon name="plus" size={20}/>混雑を投稿</button>
          </div>
          <button className="detail-link" onClick={() => setSheet('detail')}>写真・口コミを見る <Icon name="chevron" size={17}/></button>
        </> : <div className="spot-list"><div className="list-head"><div><p>NEARBY SPOTS</p><h1>近くのスポット</h1></div><b>{visible.length}<small>件</small></b></div>{visible.map((spot) => <button key={spot.id} onClick={() => { setSelected(spot); setView('map') }}><span className={`list-number ${spot.tone}`}>{spot.walk}<small>分</small></span><div><span className={`status ${spot.tone}`}><i/>{spot.status}</span><h2>{spot.name}</h2><p>{spot.type} · {spot.distance}m · {spot.updated}</p></div><Icon name="chevron" size={18}/></button>)}</div>}
      </section>
    </main>

    <nav className="bottom-nav" aria-label="メインメニュー">
      <button className={view === 'map' ? 'active' : ''} onClick={() => setView('map')}><Icon name="map"/><span>マップ</span></button>
      <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}><Icon name="list"/><span>リスト</span></button>
      <button className="post-nav" onClick={() => setSheet('report')}><i><Icon name="plus" size={27}/></i><span>投稿</span></button>
      <button onClick={() => setSheet('checkin')}><Icon name="camera"/><span>チェックイン</span></button>
      <button onClick={() => flash(`ゲスト利用中 · ${points}ポイント`)}><Icon name="user"/><span>マイ</span></button>
    </nav>

    {sheet !== 'spot' && <div className="modal-backdrop" onClick={() => setSheet('spot')}><section className="modal" onClick={(event) => event.stopPropagation()}>
      <button className="modal-close" onClick={() => setSheet('spot')} aria-label="閉じる"><Icon name="close"/></button>
      {sheet === 'report' && <><p className="eyebrow">ONE TAP REPORT</p><h2>いま、どれくらい<br/>混んでいますか？</h2><p className="modal-copy">投稿は匿名です。近くにいる人の役に立ち、5ポイント獲得できます。</p><div className="report-options"><button onClick={() => report('空いてる')}><i className="free"/><b>空いてる</b><span>待たずに使える</span></button><button onClick={() => report('ふつう')}><i className="normal"/><b>ふつう</b><span>少し人がいる</span></button><button onClick={() => report('混んでる')}><i className="busy"/><b>混んでる</b><span>待つかもしれない</span></button></div><small className="privacy">位置情報はスポット付近にいることの確認だけに使います</small></>}
      {sheet === 'detail' && <><p className="eyebrow">COMMUNITY NOTES</p><h2>{selected.name}</h2><div className="photo-row"><div/><div/><div/></div><article className="review"><header><span>ゲストユーザー</span><time>12分前</time></header><p>駅から近くて分かりやすいです。屋根があるので雨の日も使いやすかったです。</p><footer>参考になった 12</footer></article><button className="wide-button" onClick={() => flash('写真付き投稿フォームを準備中です')}>写真・口コミを投稿する</button></>}
      {sheet === 'checkin' && <><p className="eyebrow">QR CHECK IN</p><h2>スポットのQRを<br/>読み取る</h2><div className="scanner"><span/><i/><b><Icon name="camera" size={30}/></b></div><p className="modal-copy center">現地のQRコードを枠内に合わせてください。チェックインで10ポイント獲得できます。</p><button className="wide-button" onClick={() => { setPoints((value) => value + 10); setSheet('spot'); flash('チェックイン完了 · +10 pt') }}>デモで読み取りを完了</button></>}
    </section></div>}
    {toast && <div className="toast"><Icon name="check" size={18}/>{toast}</div>}
  </div>
}

export default App
