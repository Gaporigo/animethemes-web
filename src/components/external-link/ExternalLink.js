import { faChevronCircleRight } from "@fortawesome/pro-solid-svg-icons";
import { Text } from "components/text";
import { Icon } from "components/icon";

export function ExternalLink({ href, children, ...props }) {
    return (
        <Text as="a" link href={href} target="_blank" rel="noopener" {...props}>
            <Text>{children}</Text>
            <Text noWrap>
                &nbsp;
                <Icon icon={faChevronCircleRight}/>
            </Text>
        </Text>
    );
}
