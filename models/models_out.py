from pydantic import BaseModel


class UserOut(BaseModel):
    id: int = None
    username: str = None
    email: str = None
    registration_date: str = None
    
class TimelineItemOut(BaseModel):
    date: str
    title: str
    author: str
    doi: str
    score: float
    
#文献时间线，含多个文献项及其统计信息。
class LiteratureTimelineOut(BaseModel):
    total_count: int #时间线中包含的文献总数。
    date_range: dict #时间线的时间范围，可能是一个字典，包含开始日期和结束日期。
    timeline: list[TimelineItemOut] #一个TimelineItemOut对象的列表，表示时间线上的所有文献项。
    yearly_distribution: dict #按年份分布的文献数量，键是年份，值是该年份的文献数量。
    monthly_distribution: dict #按月份分布的文献数量，键是月份，值是该月份的文献数量。

#文献时间统计信息
class LiteratureTimeStatsOut(BaseModel):
    total_literatures: int
    date_range: dict
    yearly_stats: dict
    publication_trends: dict
    quality_metrics: dict
