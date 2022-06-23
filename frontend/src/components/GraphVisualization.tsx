import React from 'react';

interface VisualizationProps {
    records: number[] // list of record id - records to visualize
}

export class GraphVisualization extends React.Component<VisualizationProps> {
    constructor(props: VisualizationProps) {
        super(props);
    }
    render() {
        return (
            <>
                <h3>Visualize:</h3>
                <ul>
                    { this.props.records.map(record => (<li key={record}>{record}</li>)) }
                </ul>
            </>

        );
    }
}