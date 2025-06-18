from pydantic import BaseModel

class ProgressSummary(BaseModel):
    phrases_learned: int
    words_known: int
    active_days: int
