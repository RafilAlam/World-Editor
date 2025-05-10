const dockContainer = document.querySelector(".dock");
const dockItems = dockContainer.querySelectorAll(".dock-item");

const defaultItemScale = 1;
const hoverItemScale = 2;
const neighbourItemScale = 1.5;

const defaultMargin = "10px";
const expandedMargin = "20px";

const updatedDockItems = () => {
    dockItems.forEach((item, index) => {
        let scale = defaultItemScale;
        let margin = defaultMargin;
        if(item.isHovered) {
            scale = hoverItemScale;
            margin = expandedMargin;
        } else if (item.isNeighbour) {
            scale = neighbourItemScale;
            margin = expandedMargin;
        }

        item.style.transform = `scale(${scale})`;
        item.style.margin = `0 ${margin}`;
    });
};

dockItems.forEach((item) => {
    item.addEventListener("mousemove", () => {
        dockItems.forEach((otherItem) => {
            otherItem.isHovered = otherItem === item;
            otherItem.isNeighbour =
                Math.abs(
                    Array.from(dockItems).indexOf(otherItem) -
                    Array.from(dockItems).indexOf(item)  
                ) == 1;
        });

        updatedDockItems();
    });
});

dockContainer.addEventListener("mouseleave", () => {
    dockItems.forEach((item) => {
        item.isHovered = item.isNeighbour = false;
    });

    updatedDockItems();
});

window.addEventListener("resize", () => {
    location.reload();
});

updatedDockItems();