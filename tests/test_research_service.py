# Project Name: Thronestead©
# File Name: test_research_service.py
# Version 6.13.2025.19.49
# Developer: Deathsgift66
from datetime import datetime

import pytest

from services.research_service import (
    start_research,
    complete_finished_research,
    list_research,
    is_tech_completed,
)


class DummyResult:
    def __init__(self, row=None, rows=None):
        self._row = row
        self._rows = rows or []

    def fetchone(self):
        return self._row

    def fetchall(self):
        return self._rows


class DummyDB:
    def __init__(self):
        self.queries = []
        self.rows = []
        self.row = None
        self.tech_row = (1, [])
        self.commits = 0

    def execute(self, query, params=None):
        q = str(query).strip()
        self.queries.append((q, params))
        if "FROM tech_catalogue" in q:
            return DummyResult(row=self.tech_row)
        if "FROM kingdom_research_tracking" in q:
            return DummyResult(rows=self.rows)
        return DummyResult()

    def commit(self):
        self.commits += 1


def test_start_research_inserts():
    db = DummyDB()
    ends_at = start_research(db, 1, "tech_a")
    assert any("INSERT INTO kingdom_research_tracking" in q for q, _ in db.queries)
    assert isinstance(ends_at, datetime)
    assert db.commits == 1


def test_start_research_prereq_check():
    db = DummyDB()
    db.tech_row = (1, ["req1"])  # tech requires req1
    db.rows = []  # no completed techs
    with pytest.raises(ValueError):
        start_research(db, 1, "tech_a")


def test_complete_finished_updates():
    db = DummyDB()
    complete_finished_research(db, 1)
    assert any("UPDATE kingdom_research_tracking" in q for q, _ in db.queries)
    assert db.commits == 1


def test_list_and_check():
    db = DummyDB()
    db.rows = [("tech_a", "completed", 100, "2025-01-01")]
    results = list_research(db, 1)
    assert results[0]["tech_code"] == "tech_a"
    assert is_tech_completed(db, 1, "tech_a") is True

