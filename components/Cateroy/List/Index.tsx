import { Grid, Card, List } from "@arco-design/web-react";
import WebLink from "@/components/base/WebLink";
import type { apiCategory } from "@/pages/api/post/getCat";
export const CategoryList = (values: apiCategory) => {
  return (
    <>
      <Grid.Col xxl={8} xl={8} lg={12} md={12} xs={24} sm={24}>
        <Card title={values.cat}>
          {values.posts.length > 0 &&
            values.posts.map((val, index) => {
              return (
                <>
                  <List style={{ width: "100%" }} header={null}>
                    <List.Item>
                      <WebLink
                        query={{ id: val.post.id }}
                        pathname="/blog/view/[id]"
                        status="success"
                      >
                        {val.post.title}
                      </WebLink>
                    </List.Item>
                  </List>
                </>
              );
            })}
        </Card>
      </Grid.Col>
    </>
  );
};
