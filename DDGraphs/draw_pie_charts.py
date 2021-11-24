from typing import Optional, TypedDict
from IPython.display import Javascript

from DDGraphs.custom_typings import StringVector, Vector


class PieChartParams(TypedDict):
    title: Optional[str]
    palette: Optional[str]
    theme: Optional[str]
    customHeight: Optional[int]
    customWidth: Optional[int]


def draw_pie_chart(keys: StringVector, values: Vector, params: PieChartParams) -> Javascript:
    return Javascript(
        """(function(element){DDGraphs.drawPieChart(element.get(0), %s, %s,
    %s);})(element);"""
        % (keys, values, params)
    )
