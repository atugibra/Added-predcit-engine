-- ============================================================
-- MIGRATION 04: Predictions + ML Model tables
-- Run in Supabase SQL Editor
-- ============================================================

-- 1. PREDICTIONS TABLE - stores every prediction with all market probabilities
CREATE TABLE IF NOT EXISTS predictions (
    id                  SERIAL PRIMARY KEY,
    match_id            INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    league_id           INTEGER NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
    season_id           INTEGER NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
    home_team_id        INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    away_team_id        INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,

    -- 1X2 Market
    home_win_prob       DECIMAL(6,4),
    draw_prob           DECIMAL(6,4),
    away_win_prob       DECIMAL(6,4),
    predicted_outcome   VARCHAR(10),         -- 'home', 'draw', 'away'
    predicted_home_goals SMALLINT,
    predicted_away_goals SMALLINT,

    -- Expected goals (continuous)
    home_xg             DECIMAL(5,2),
    away_xg             DECIMAL(5,2),

    -- Over/Under Markets
    over_1_5_prob       DECIMAL(6,4),
    over_2_5_prob       DECIMAL(6,4),
    over_3_5_prob       DECIMAL(6,4),
    under_1_5_prob      DECIMAL(6,4),
    under_2_5_prob      DECIMAL(6,4),
    under_3_5_prob      DECIMAL(6,4),

    -- BTTS Market
    btts_yes_prob       DECIMAL(6,4),
    btts_no_prob        DECIMAL(6,4),

    -- Double Chance Market
    dc_1x_prob          DECIMAL(6,4),
    dc_x2_prob          DECIMAL(6,4),
    dc_12_prob          DECIMAL(6,4),

    -- Correct Score (top 10 as JSONB array)
    correct_scores      JSONB,               -- [{"score":"1-0","prob":0.12}, ...]

    -- Half-Time Markets
    ht_home_win_prob    DECIMAL(6,4),
    ht_draw_prob        DECIMAL(6,4),
    ht_away_win_prob    DECIMAL(6,4),

    -- Clean Sheet
    home_clean_sheet_prob DECIMAL(6,4),
    away_clean_sheet_prob DECIMAL(6,4),

    -- Win To Nil
    home_win_to_nil_prob  DECIMAL(6,4),
    away_win_to_nil_prob  DECIMAL(6,4),

    -- First Half Over/Under
    fh_over_0_5_prob    DECIMAL(6,4),
    fh_over_1_5_prob    DECIMAL(6,4),

    -- Total Goals Band
    goals_0_1_prob      DECIMAL(6,4),
    goals_2_3_prob      DECIMAL(6,4),
    goals_4_plus_prob   DECIMAL(6,4),

    -- ML Model columns
    ml_home_win_prob    DECIMAL(6,4),
    ml_draw_prob        DECIMAL(6,4),
    ml_away_win_prob    DECIMAL(6,4),
    ml_predicted_outcome VARCHAR(10),
    ml_model_id         INTEGER,

    -- Ensemble (blended weighted + ML)
    ensemble_home_win_prob DECIMAL(6,4),
    ensemble_draw_prob     DECIMAL(6,4),
    ensemble_away_win_prob DECIMAL(6,4),
    ensemble_outcome       VARCHAR(10),

    -- Engine metadata
    model_version       VARCHAR(20) DEFAULT 'v2',
    confidence          DECIMAL(5,2),        -- 0-100
    features_used       JSONB,               -- snapshot of all input metrics
    factor_breakdown    JSONB,               -- [{name, weight, home_score, away_score}, ...]

    -- Actual results (auto-filled on sync when scores arrive)
    actual_home_goals   SMALLINT,
    actual_away_goals   SMALLINT,
    actual_outcome      VARCHAR(10),
    outcome_correct     BOOLEAN,
    score_correct       BOOLEAN,
    over_2_5_correct    BOOLEAN,
    btts_correct        BOOLEAN,

    -- Timestamps
    predicted_at        TIMESTAMPTZ DEFAULT NOW(),
    resolved_at         TIMESTAMPTZ,

    UNIQUE(match_id)
);

CREATE INDEX IF NOT EXISTS idx_pred_league_season ON predictions(league_id, season_id);
CREATE INDEX IF NOT EXISTS idx_pred_match ON predictions(match_id);
CREATE INDEX IF NOT EXISTS idx_pred_unresolved ON predictions(actual_outcome) WHERE actual_outcome IS NULL;
CREATE INDEX IF NOT EXISTS idx_pred_correct ON predictions(outcome_correct) WHERE outcome_correct IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pred_teams ON predictions(home_team_id, away_team_id);


-- 2. ML MODELS TABLE - registry of trained models per league
CREATE TABLE IF NOT EXISTS ml_models (
    id              SERIAL PRIMARY KEY,
    league_id       INTEGER NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
    model_type      VARCHAR(50) NOT NULL,    -- 'random_forest', 'gradient_boosting', 'logistic_regression'
    model_data      BYTEA,                   -- serialized sklearn model
    feature_names   JSONB,                   -- ordered list of feature column names
    accuracy        DECIMAL(5,4),            -- cross-validation accuracy
    precision_score DECIMAL(5,4),
    recall_score    DECIMAL(5,4),
    f1_score        DECIMAL(5,4),
    sample_count    INTEGER,                 -- number of training samples
    hyperparams     JSONB,                   -- model hyperparameters
    is_active       BOOLEAN DEFAULT TRUE,    -- only one active model per league
    trained_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(league_id, is_active) -- ensures only one active per league (with partial index)
);

CREATE INDEX IF NOT EXISTS idx_ml_models_league ON ml_models(league_id);
CREATE INDEX IF NOT EXISTS idx_ml_models_active ON ml_models(league_id) WHERE is_active = TRUE;


-- 3. ML TRAINING DATA - feature vectors extracted from completed matches
CREATE TABLE IF NOT EXISTS ml_training_data (
    id              SERIAL PRIMARY KEY,
    match_id        INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    league_id       INTEGER NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
    season_id       INTEGER NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
    features        JSONB NOT NULL,          -- {feature_name: value, ...}
    outcome         VARCHAR(10) NOT NULL,    -- 'home', 'draw', 'away'
    home_goals      SMALLINT,
    away_goals      SMALLINT,
    total_goals     SMALLINT,
    btts            BOOLEAN,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(match_id)
);

CREATE INDEX IF NOT EXISTS idx_mltd_league ON ml_training_data(league_id);
CREATE INDEX IF NOT EXISTS idx_mltd_league_season ON ml_training_data(league_id, season_id);


-- Comments
COMMENT ON TABLE predictions IS 'Stores predictions for all matches across all markets (1X2, O/U, BTTS, DC, CS, HT, etc.)';
COMMENT ON TABLE ml_models IS 'Registry of trained ML models per league with serialized model data';
COMMENT ON TABLE ml_training_data IS 'Feature vectors extracted from completed matches for ML training';
