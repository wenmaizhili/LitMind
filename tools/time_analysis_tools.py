from datetime import datetime, date
from collections import defaultdict, Counter
from typing import List, Dict, Any
from models import Literature
from tortoise.functions import Count, Extract


async def analyze_literature_timeline(username: str) -> Dict[str, Any]:
    """分析用户文献的时间轴数据"""
    # 获取用户的所有文献记录，按发布日期排序
    literatures = await Literature.filter(users__username=username).order_by('publication_date').values(
        'id', 'title', 'author', 'publication_date', 'doi', 'score'
    )
    
    if not literatures:
        return None
    
    # 构建时间轴数据
    timeline_data = {
        "total_count": len(literatures),
        "date_range": {
            "start_date": str(literatures[0]['publication_date']),
            "end_date": str(literatures[-1]['publication_date'])
        },
        "timeline": [],
        "yearly_distribution": {},
        "monthly_distribution": {}
    }
    
    # 按年份和月份统计
    yearly_count = defaultdict(int)
    monthly_count = defaultdict(int)
    
    for lit in literatures:
        pub_date = lit['publication_date']
        year = pub_date.year
        month = f"{year}-{pub_date.month:02d}"
        
        yearly_count[year] += 1
        monthly_count[month] += 1
        
        # 添加到时间轴
        timeline_data["timeline"].append({
            "date": str(pub_date),
            "title": lit['title'],
            "author": lit['author'],
            "doi": lit['doi'],
            "score": lit['score']
        })
    
    # 转换为有序字典
    timeline_data["yearly_distribution"] = dict(sorted(yearly_count.items()))
    timeline_data["monthly_distribution"] = dict(sorted(monthly_count.items()))
    
    return timeline_data


async def get_literature_time_statistics(username: str) -> Dict[str, Any]:
    """获取用户文献的时间统计信息"""
    # 获取用户的所有文献记录
    literatures = await Literature.filter(users__username=username).values(
        'publication_date', 'score', 'is_referenced_by_count'
    )
    
    if not literatures:
        return None
    
    # 计算统计信息
    pub_dates = [lit['publication_date'] for lit in literatures]
    years = [date.year for date in pub_dates]
    
    stats = {
        "total_literatures": len(literatures),
        "date_range": {
            "earliest": str(min(pub_dates)),
            "latest": str(max(pub_dates)),
            "span_years": max(years) - min(years) + 1
        },
        "yearly_stats": {},
        "publication_trends": {
            "most_productive_year": None,
            "least_productive_year": None,
            "average_per_year": 0
        },
        "quality_metrics": {
            "average_score": 0,
            "average_citations": 0,
            "high_quality_count": 0  # score > 80的文献数量
        }
    }
    
    # 按年份统计
    year_stats = defaultdict(lambda: {
        'count': 0, 
        'total_score': 0, 
        'total_citations': 0,
        'avg_score': 0,
        'avg_citations': 0
    })
    
    total_score = 0
    total_citations = 0
    high_quality_count = 0
    
    for lit in literatures:
        year = lit['publication_date'].year
        score = lit['score'] or 0
        citations = lit['is_referenced_by_count'] or 0
        
        year_stats[year]['count'] += 1
        year_stats[year]['total_score'] += score
        year_stats[year]['total_citations'] += citations
        
        total_score += score
        total_citations += citations
        
        if score > 80:
            high_quality_count += 1
    
    # 计算每年的平均值
    for year, data in year_stats.items():
        if data['count'] > 0:
            data['avg_score'] = round(data['total_score'] / data['count'], 2)
            data['avg_citations'] = round(data['total_citations'] / data['count'], 2)
    
    # 找出最高产和最低产的年份
    year_counts = {year: data['count'] for year, data in year_stats.items()}
    if year_counts:
        most_productive = max(year_counts, key=year_counts.get)
        least_productive = min(year_counts, key=year_counts.get)
        
        stats["publication_trends"]["most_productive_year"] = {
            "year": most_productive,
            "count": year_counts[most_productive]
        }
        stats["publication_trends"]["least_productive_year"] = {
            "year": least_productive,
            "count": year_counts[least_productive]
        }
        stats["publication_trends"]["average_per_year"] = round(
            len(literatures) / len(year_counts), 2
        )
    
    # 质量指标
    stats["quality_metrics"]["average_score"] = round(total_score / len(literatures), 2)
    stats["quality_metrics"]["average_citations"] = round(total_citations / len(literatures), 2)
    stats["quality_metrics"]["high_quality_count"] = high_quality_count
    
    # 转换年份统计为有序字典
    stats["yearly_stats"] = dict(sorted(year_stats.items()))
    
    return stats


async def compare_literature_timelines(usernames: List[str]) -> Dict[str, Any]:
    #比较多个用户的文献时间轴（可选）
    comparison_data = {
        "users": {},
        "comparison_metrics": {}
    }
    
    for username in usernames:
        user_timeline = await analyze_literature_timeline(username)
        if user_timeline:
            comparison_data["users"][username] = user_timeline
    
    # 添加比较指标
    if len(comparison_data["users"]) > 1:
        # 计算各种比较指标，如发表频率、质量对比等
        pass
    
    return comparison_data
