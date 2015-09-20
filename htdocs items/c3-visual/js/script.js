var chart = c3.generate({
    bindto: '#chart',
    data: {
        columns: [
            ['average hours of sleep', 5, 6, 7, 6, 7, 9, 10]
        ],
        type: 'spline'
    },
    axis: {
        x: {
            type: 'category',
            categories: ['01-01-2015','01-02-2015','01-03-2015','01-04-2015','01-05-2015','01-06-2015','01-07-2015']
        }
    }
});