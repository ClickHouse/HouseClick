"use client"
import { Flyout, Link, Icon, Text } from "@clickhouse/click-ui"


export default function DebugQuery(metadata) {

    const description = `Query name: ${metadata.metadata.query}`

    return (
        <Flyout>
            <Flyout.Trigger>
                <div className="flex items-center"><Link><Icon name="eye" size="md" color="gray" /></Link></div>
            </Flyout.Trigger>
            <Flyout.Content
                strategy="fixed"
                size="default"
            >
                <Flyout.Header
                    title="Query execution details"
                    description={description}
                />
                <Flyout.Body align="default" >


                    <Flyout.Element><div id="code-block" className="flex flex-col gap-4 w-full">
                        <Text size="lg">Execution time: {Math.round(metadata.metadata.elapsedTime * 100) / 100} ms</Text>
                        {/* <SyntaxHighlighter className="w-full" lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
                            wrapLines={true} language="sql" style={dark}>
                            {metadata.metadata.queryString.replace(/ +(?= )/g, '')}
                        </SyntaxHighlighter> */}
                        <Flyout.CodeBlock  language="sql" wrapLines={true} statement={metadata.metadata.queryString.replace(/ +(?= )/g, '')} />
                    </div>
                    </Flyout.Element>
                </Flyout.Body>
                <Flyout.Footer>
                    <Flyout.Close label="Close" />
                </Flyout.Footer>
            </Flyout.Content>
        </Flyout>
    )
}
