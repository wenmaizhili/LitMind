from datetime import date
from pydantic import BaseModel, EmailStr, field_validator, Field
from models import User
from enum import Enum
from typing import Optional, Dict, List
import re


class UserLoginIn(BaseModel):
    username: str = None
    password: str
    email: str = None  # 使用 EmailStr 类型自动校验邮箱


class UserRegisterIn(BaseModel):
    username: str = None
    password: str
    email: EmailStr = None  # 使用 EmailStr 类型自动校验邮箱

    # 校验器
    @field_validator("username")
    @classmethod
    def check_username(cls, value: str):
        assert len(value) >= 4, "用户名至少为4位"
        assert len(value) <= 16, "用户名不超过16位"
        assert value.isalnum(), "用户名只能包含字母和数字"
        return value

    # 校验器
    @field_validator("password")
    @classmethod
    def check_password(cls, value: str):
        assert len(value) > 6, "密码长度必须大于6"
        assert any(c.isalpha() for c in value), "密码必须包含字母"
        assert any(c.isdigit() for c in value), "密码必须包含数字"
        return value


class LiteratureIn(BaseModel):
    title: str
    author: str
    publication_date: date
    doi: str
    url: str
    reference_count: int
    reference_doi: list[str] = []  # 参考文献的DOI列表，默认为空列表
    is_referenced_by_count: int = 0  # 被引用次数，默认为0
    score: float = 0.0  # Crossref评分，默认为0.0


class FilenameIn(BaseModel):
    filenames: List[str]


# 定义排序方式的枚举
class SortMethod(str, Enum):
    RELEVANCE = "relevance"  # 相关性排序（默认）
    SCORE = "score"  # 按Crossref评分排序
    UPDATED = "updated"  # 按更新时间排序
    CITATIONS = "is-referenced-by-count"  # 按被引用次数排序


class SearchIn(BaseModel):
    """
    Crossref文献搜索输入参数模型

    Attributes:
        query: 搜索关键词（支持DOI、作者、标题等，如 'doi:10.1234/abc' 或 'author:"John Smith"'）
        rows: 每页返回数量（1-1000，默认10）
        offset: 分页偏移量（从0开始，默认0）
        sort: 排序方式（默认按相关性）
        filter: 过滤条件字符串（格式：'field:value'，如 'from-pub-date:2023,type:journal-article'）
    """
    query: str = Field(..., description="搜索关键词（必填）")
    rows: int = Field(
        default=10,
        ge=1,
        le=1000,
        description="每页返回数量（范围1-1000，默认10）"
    )
    offset: int = Field(
        default=0,
        ge=0,
        description="分页偏移量（从0开始，默认0）"
    )
    sort: SortMethod = Field(
        default=SortMethod.RELEVANCE,
        description="排序方式（默认按相关性）"
    )

    filter: Optional[str] = Field(
        default=None,
        description="过滤条件字符串（格式：'field:value'，如 'from-pub-date:2023,type:journal-article'）"
    )

    @field_validator("filter")
    @classmethod
    def validate_filter(cls, value: Optional[str]) -> Optional[str]:
        if value:
            # 简单验证过滤条件格式（实际使用时可根据Crossref支持的字段进一步验证）
            for pair in value.split(','):
                if ':' not in pair:
                    raise ValueError(f"过滤条件格式错误，应为 'field:value'，实际得到: {pair}")
        return value


class DOIIn(BaseModel):
    doi: str

    @field_validator("doi")
    @classmethod
    def validate_doi_format(cls, value):
        # DOI 正则表达式模式
        # 基本格式: 10.XXXX/XXXXX
        doi_pattern = r'^10\.\d{4,9}/[-._;()/:A-Z0-9]+$'

        # 检查是否匹配模式
        if not re.match(doi_pattern, value, re.IGNORECASE):
            raise ValueError('Invalid DOI format. Expected format: 10.XXXX/XXXXX')

        # 检查长度 (DOI 通常不超过 255 个字符)
        if len(value) > 255:
            raise ValueError('DOI is too long. Maximum length is 255 characters.')

        return value


class TranslationIn(BaseModel):
    text: str
    source_language: str
    translated_language: str
    style: str

    @field_validator("source_language", "translated_language")
    @classmethod
    def validate_language(cls, value: str) -> str:
        allowed_languages = {"Chinese", "English"}
        if value not in allowed_languages:
            raise ValueError(f"Language must be one of {allowed_languages}")
        return value

    @field_validator("style")
    @classmethod
    def validate_style(cls, value: str) -> str:
        allowed_styles = {"general", "academic"}
        if value not in allowed_styles:
            raise ValueError(f"Style must be one of {allowed_styles}")
        return value


class TranslationFileIn(BaseModel):
    filename: str
    source_language: str
    translated_language: str
    style: str

    @field_validator("source_language", "translated_language")
    @classmethod
    def validate_language(cls, value: str) -> str:
        allowed_languages = {"Chinese", "English"}
        if value not in allowed_languages:
            raise ValueError(f"Language must be one of {allowed_languages}")
        return value

    @field_validator("style")
    @classmethod
    def validate_style(cls, value: str) -> str:
        allowed_styles = {"general", "academic"}
        if value not in allowed_styles:
            raise ValueError(f"Style must be one of {allowed_styles}")
        return value


class SummaryIn(BaseModel):
    text: str
    language: str = "Chinese"
    detail_level: str = "medium"

    @field_validator("language")
    @classmethod
    def validate_language(cls, value: str) -> str:
        allowed_languages = {"Chinese", "English"}
        if value not in allowed_languages:
            raise ValueError(f"Language must be one of {allowed_languages}")
        return value

    @field_validator("detail_level")
    @classmethod
    def validate_detail_level(cls, value: str) -> str:
        allowed_level = {"high", "medium", "low"}
        if value not in allowed_level:
            raise ValueError(f"detail_level must be one of {allowed_level}")
        return value


class TalkIn(BaseModel):
    text: str
    filenames: List[str] = None  # 可选的文件名，用于上传文件时


class ThemeIn(BaseModel):
    literature_ids: List[int] = Field(..., description="文献ID列表")
    theme: str = Field(..., description="主题标签")

    @field_validator("theme")
    @classmethod
    def validate_tags(cls, value: str) -> str:
        if not value or value=="None":
            raise ValueError("主题标签列表不能为空和None")
        return value

class ThemeChangeIn(BaseModel):
    theme_old: str = Field(..., description="原主题标签")
    theme_new: str = Field(..., description="新主题标签")

    @field_validator("theme_old","theme_new")
    @classmethod
    def validate_tags(cls, value: str) -> str:
        if not value or value=="None":
            raise ValueError("主题标签不能为空和None")
        return value