import { FormEvent, useMemo, useState } from "react";

type FormData = {
  name: string;
  kana: string;
  email: string;
  phone: string;
  prefecture: string;
  school: string;
  department: string;
  graduationYear: string;
  graduationMonth: string;
  graduationStatus: string;
  internshipTypes: string[];
  preferredPeriod: string;
  github: string;
  languages: string[];
  source: string[];
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialForm: FormData = {
  name: "",
  kana: "",
  email: "",
  phone: "",
  prefecture: "",
  school: "",
  department: "",
  graduationYear: "",
  graduationMonth: "",
  graduationStatus: "卒業見込み",
  internshipTypes: [],
  preferredPeriod: "週3〜4日（中長期間でがっつり現場を学びたい）",
  github: "",
  languages: [],
  source: ["学校・キャリアセンターの紹介"],
};

const internshipOptions = [
  "AIエンジニア／データサイエンティスト",
  "ホワイトハッカー／セキュリティエンジニア",
  "ECマーケター／ネットビジネス企画",
];

const languageOptions = ["HTML / CSS", "JavaScript", "Python"];

const sourceOptions = [
  "学校・キャリアセンターの紹介",
  "求人サイト（マイナビ・リクナビ等）",
  "SNS・インターネット広告",
  "その他",
];

const prefectures = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];

function App() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showConfirm, setShowConfirm] = useState(false);

  const graduationYears = useMemo(() => {
    const now = new Date().getFullYear();
    return Array.from({ length: 8 }, (_, index) => String(now + index));
  }, []);

  const setField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  };

  const toggleArrayValue = (
    key: "internshipTypes" | "languages" | "source",
    value: string,
  ) => {
    const values = form[key];
    setField(
      key,
      values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value],
    );
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) nextErrors.name = "お名前を入力してください";
    if (!form.kana.trim()) {
      nextErrors.kana = "フリガナを入力してください";
    } else if (!/^[ァ-ヶー\s]+$/.test(form.kana.trim())) {
      nextErrors.kana = "フリガナは全角カタカナで入力してください";
    }

    if (!form.email.trim()) {
      nextErrors.email = "メールアドレスを入力してください";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "正しいメールアドレスを入力してください";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "電話番号を入力してください";
    } else if (!/^\d{10,11}$/.test(form.phone)) {
      nextErrors.phone = "電話番号はハイフンなしの10〜11桁で入力してください";
    }

    if (!form.prefecture) nextErrors.prefecture = "都道府県を選択してください";
    if (!form.school.trim()) nextErrors.school = "学校名を入力してください";
    if (!form.department.trim()) nextErrors.department = "学部・学科名を入力してください";
    if (!form.graduationYear || !form.graduationMonth) {
      nextErrors.graduationYear = "卒業予定年月を選択してください";
    }
    if (!form.graduationStatus) nextErrors.graduationStatus = "卒業状況を選択してください";
    if (form.internshipTypes.length === 0) {
      nextErrors.internshipTypes = "希望するインターン種類を選択してください";
    }
    if (!form.preferredPeriod) nextErrors.preferredPeriod = "参加希望の日数を選択してください";
    if (form.github && !/^https?:\/\/(www\.)?github\.com\/.+/i.test(form.github)) {
      nextErrors.github = "GitHubのURLを正しく入力してください";
    }
    if (form.source.length === 0) nextErrors.source = "当社を知ったきっかけを選択してください";

    setErrors(nextErrors);

    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      document.querySelector(`[data-field="${firstError}"]`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    return Object.keys(nextErrors).length === 0;
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (validate()) {
      setShowConfirm(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const reset = () => {
    setForm(initialForm);
    setErrors({});
    setShowConfirm(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (showConfirm) {
    return (
      <main className="page-shell">
        <div className="form-card confirmation-card">
          <h1>入力内容の確認</h1>
          <p className="lead">以下の内容で送信してよろしいですか。</p>

          <dl className="confirmation-list">
            <ConfirmRow label="お名前" value={form.name} />
            <ConfirmRow label="フリガナ" value={form.kana} />
            <ConfirmRow label="メールアドレス" value={form.email} />
            <ConfirmRow label="電話番号" value={form.phone} />
            <ConfirmRow label="居住地" value={form.prefecture} />
            <ConfirmRow label="学校名" value={form.school} />
            <ConfirmRow label="学部・学科名" value={form.department} />
            <ConfirmRow
              label="卒業予定年月"
              value={`${form.graduationYear}年 ${form.graduationMonth}月`}
            />
            <ConfirmRow label="卒業状況" value={form.graduationStatus} />
            <ConfirmRow label="希望インターン" value={form.internshipTypes.join("、")} />
            <ConfirmRow label="参加希望日数" value={form.preferredPeriod} />
            <ConfirmRow label="GitHub" value={form.github || "未入力"} />
            <ConfirmRow
              label="使用可能な言語"
              value={form.languages.length ? form.languages.join("、") : "未選択"}
            />
            <ConfirmRow label="当社を知ったきっかけ" value={form.source.join("、")} />
          </dl>

          <div className="button-row">
            <button className="secondary-button" type="button" onClick={() => setShowConfirm(false)}>
              入力画面に戻る
            </button>
            <button
              className="primary-button"
              type="button"
              onClick={() => alert("送信処理のサンプルです。実際のAPIに接続してください。")}
            >
              この内容で送信
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <form className="form-card" onSubmit={submit} noValidate>
        <header className="form-header">
          <h1>インターンシップ エントリーフォーム</h1>
          <p>下記フォームに必要事項をご入力のうえ、「確認画面へ進む」ボタンを押してください。</p>
          <p><span className="required-note">*</span> は必須項目です。</p>
        </header>

        <Section title="お申込者情報">
          <TextField
            label="お名前"
            required
            placeholder="例）田中 花子"
            value={form.name}
            error={errors.name}
            fieldName="name"
            onChange={(value) => setField("name", value)}
          />

          <TextField
            label="フリガナ"
            required
            description="全角カタカナで入力してください。"
            placeholder="例）タナカ ハナコ"
            value={form.kana}
            error={errors.kana}
            fieldName="kana"
            onChange={(value) => setField("kana", value)}
          />

          <TextField
            label="メールアドレス"
            required
            description="確認メールが届くアドレスを入力してください。"
            placeholder="例）hanako@example.ac.jp"
            type="email"
            value={form.email}
            error={errors.email}
            fieldName="email"
            onChange={(value) => setField("email", value)}
          />

          <TextField
            label="電話番号"
            required
            description="ハイフン（-）なしで入力してください。"
            placeholder="例）09012345678"
            inputMode="numeric"
            value={form.phone}
            error={errors.phone}
            fieldName="phone"
            compact
            onChange={(value) => setField("phone", value.replace(/\D/g, ""))}
          />

          <FieldWrapper
            label="居住地（都道府県）"
            required
            error={errors.prefecture}
            fieldName="prefecture"
          >
            <select
              className={errors.prefecture ? "input error-input compact-control" : "input compact-control"}
              value={form.prefecture}
              onChange={(event) => setField("prefecture", event.target.value)}
            >
              <option value="">選択してください</option>
              {prefectures.map((prefecture) => (
                <option key={prefecture}>{prefecture}</option>
              ))}
            </select>
          </FieldWrapper>
        </Section>

        <Section title="学校・卒業情報">
          <TextField
            label="学校名"
            required
            placeholder="例）〇〇大学"
            value={form.school}
            error={errors.school}
            fieldName="school"
            onChange={(value) => setField("school", value)}
          />

          <TextField
            label="学部・学科名"
            required
            placeholder="例）情報工学部 AIシステム学科"
            value={form.department}
            error={errors.department}
            fieldName="department"
            onChange={(value) => setField("department", value)}
          />

          <FieldWrapper
            label="卒業予定年月"
            required
            error={errors.graduationYear}
            fieldName="graduationYear"
          >
            <div className="date-selects">
              <select
                className={errors.graduationYear ? "input error-input" : "input"}
                value={form.graduationYear}
                onChange={(event) => setField("graduationYear", event.target.value)}
              >
                <option value=""></option>
                {graduationYears.map((year) => <option key={year}>{year}</option>)}
              </select>
              <span>年</span>
              <select
                className={errors.graduationYear ? "input error-input" : "input"}
                value={form.graduationMonth}
                onChange={(event) => setField("graduationMonth", event.target.value)}
              >
                <option value=""></option>
                {Array.from({ length: 12 }, (_, index) => String(index + 1)).map((month) => (
                  <option key={month}>{month}</option>
                ))}
              </select>
              <span>月</span>
            </div>
          </FieldWrapper>

          <FieldWrapper
            label="卒業状況"
            required
            error={errors.graduationStatus}
            fieldName="graduationStatus"
          >
            <div className="inline-options">
              {["卒業済", "卒業見込み"].map((status) => (
                <label className="choice-label" key={status}>
                  <input
                    type="radio"
                    name="graduationStatus"
                    value={status}
                    checked={form.graduationStatus === status}
                    onChange={(event) => setField("graduationStatus", event.target.value)}
                  />
                  {status}
                </label>
              ))}
            </div>
          </FieldWrapper>
        </Section>

        <Section title="希望内容">
          <FieldWrapper
            label="希望するインターン種類"
            required
            description="該当するものをすべて選択してください。"
            error={errors.internshipTypes}
            fieldName="internshipTypes"
          >
            <div className="stacked-options">
              {internshipOptions.map((option) => (
                <Checkbox
                  key={option}
                  label={option}
                  checked={form.internshipTypes.includes(option)}
                  onChange={() => toggleArrayValue("internshipTypes", option)}
                />
              ))}
            </div>
          </FieldWrapper>

          <FieldWrapper
            label="参加希望の日数"
            required
            error={errors.preferredPeriod}
            fieldName="preferredPeriod"
          >
            <div className="stacked-options">
              {[
                "週1〜2日（授業と両立して始めたい）",
                "週3〜4日（中長期間でがっつり現場を学びたい）",
                "週5日（夏休み・春休みのフルタイム）",
              ].map((option) => (
                <label className="choice-label" key={option}>
                  <input
                    type="radio"
                    name="preferredPeriod"
                    value={option}
                    checked={form.preferredPeriod === option}
                    onChange={(event) => setField("preferredPeriod", event.target.value)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </FieldWrapper>
        </Section>

        <Section title="スキル・作品">
          <TextField
            label="GitHub / ポートフォリオURL"
            optional
            description="作品がある方は、アピール用にURLを入力してください。"
            placeholder="例）https://github.com/your-username"
            type="url"
            value={form.github}
            error={errors.github}
            fieldName="github"
            onChange={(value) => setField("github", value)}
          />

          <FieldWrapper
            label="使用可能なプログラミング言語"
            optional
            description="該当するものをすべて選択してください。"
            fieldName="languages"
          >
            <div className="stacked-options">
              {languageOptions.map((language) => (
                <Checkbox
                  key={language}
                  label={language}
                  checked={form.languages.includes(language)}
                  onChange={() => toggleArrayValue("languages", language)}
                />
              ))}
            </div>
          </FieldWrapper>
        </Section>

        <Section title="アンケート">
          <FieldWrapper
            label="当社を知ったきっかけ"
            required
            description="該当するものをすべて選択してください。"
            error={errors.source}
            fieldName="source"
          >
            <div className="stacked-options">
              {sourceOptions.map((source) => (
                <Checkbox
                  key={source}
                  label={source}
                  checked={form.source.includes(source)}
                  onChange={() => toggleArrayValue("source", source)}
                />
              ))}
            </div>
          </FieldWrapper>
        </Section>

        <div className="button-row">
          <button className="secondary-button" type="button" onClick={reset}>
            入力内容をリセット
          </button>
          <button className="primary-button" type="submit">
            確認画面へ進む →
          </button>
        </div>
      </form>
    </main>
  );
}

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <section className="form-section">
      <h2>{title}</h2>
      <div className="section-body">{children}</div>
    </section>
  );
}

type FieldWrapperProps = {
  label: string;
  required?: boolean;
  optional?: boolean;
  description?: string;
  error?: string;
  fieldName: string;
  children: React.ReactNode;
};

function FieldWrapper({
  label,
  required,
  optional,
  description,
  error,
  fieldName,
  children,
}: FieldWrapperProps) {
  return (
    <div className="field-group" data-field={fieldName}>
      <div className="label-line">
        <span className="field-label">{label}</span>
        {required && <span className="badge required-badge">必須</span>}
        {optional && <span className="badge optional-badge">任意</span>}
        {error && <span className="inline-error">※{error}</span>}
      </div>
      {description && <p className="field-description">{description}</p>}
      {children}
    </div>
  );
}

type TextFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  required?: boolean;
  optional?: boolean;
  description?: string;
  error?: string;
  fieldName: string;
  compact?: boolean;
  onChange: (value: string) => void;
};

function TextField({
  label,
  value,
  placeholder,
  type = "text",
  inputMode,
  required,
  optional,
  description,
  error,
  fieldName,
  compact,
  onChange,
}: TextFieldProps) {
  return (
    <FieldWrapper
      label={label}
      required={required}
      optional={optional}
      description={description}
      error={error}
      fieldName={fieldName}
    >
      <input
        className={`${error ? "input error-input" : "input"} ${compact ? "compact-control" : ""}`}
        type={type}
        inputMode={inputMode}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </FieldWrapper>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="choice-label">
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="confirmation-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export default App;
