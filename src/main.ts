const DESKTOP_QUERY = "(min-width: 1025px)";

type CardItem = {
  category: string;
  title: string;
  mediaLabel: string;
  mediaClassName: string;
  href: string;
};

type CardSection = {
  title: string;
  description: string;
  href: string;
  cards: CardItem[];
};

const sections: CardSection[] = [
  {
    title: "고객 사례",
    description: "업무 환경에 맞춘 솔루션 적용 사례",
    href: "#",
    cards: [
      {
        category: "고객 사례",
        title: "물류센터 출력 업무를 통합 관리한 사례",
        mediaLabel: "카드 1",
        mediaClassName: "card-media-1",
        href: "#",
      },
      {
        category: "고객 사례",
        title: "금융 지점의 문서 보안 프로세스 개선",
        mediaLabel: "카드 2",
        mediaClassName: "card-media-2",
        href: "#",
      },
      {
        category: "고객 사례",
        title: "제조 현장의 장비 운영 비용 절감 프로젝트",
        mediaLabel: "카드 3",
        mediaClassName: "card-media-3",
        href: "#",
      },
    ],
  },
  {
    title: "회사 소식",
    description: "제품과 서비스 운영 소식",
    href: "#",
    cards: [
      {
        category: "회사 소식",
        title: "공공기관 전용 보안 출력 서비스 출시",
        mediaLabel: "카드 4",
        mediaClassName: "card-media-4",
        href: "#",
      },
      {
        category: "회사 소식",
        title: "파트너사 대상 서비스 교육 프로그램 운영",
        mediaLabel: "카드 5",
        mediaClassName: "card-media-5",
        href: "#",
      },
      {
        category: "회사 소식",
        title: "신규 고객지원 센터 오픈 및 운영 시간 확대",
        mediaLabel: "카드 6",
        mediaClassName: "card-media-6",
        href: "#",
      },
    ],
  },
];

type HorizontalElements = {
  section: HTMLElement;
  track: HTMLElement;
  title: HTMLElement;
  description: HTMLElement;
  link: HTMLAnchorElement;
  groups: HTMLElement[];
};

const createElement = <TagName extends keyof HTMLElementTagNameMap>(
  tagName: TagName,
  className?: string,
): HTMLElementTagNameMap[TagName] => {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  return element;
};

const renderSections = (track: HTMLElement): void => {
  const fragment = document.createDocumentFragment();

  sections.forEach((section) => {
    const group = createElement("article", "card-group");
    group.dataset.title = section.title;
    group.dataset.description = section.description;
    group.dataset.linkLabel = `${section.title} 더보기`;
    group.dataset.href = section.href;

    const header = createElement("header", "card-group__header inner");
    const title = createElement("h2");
    const description = createElement("p");
    const link = createElement("a");

    title.textContent = section.title;
    description.textContent = section.description;
    link.textContent = "더보기";
    link.href = section.href;
    link.setAttribute("aria-label", `${section.title} 더보기`);

    header.append(title, description, link);

    const row = createElement("div", "card-row");

    section.cards.forEach((card) => {
      const cardLink = createElement("a", "case-card");
      const media = createElement("figure", `case-card__media ${card.mediaClassName}`);
      const label = createElement("span", "media-label");
      const category = createElement("p");
      const cardTitle = createElement("h3");

      cardLink.href = card.href;
      label.textContent = card.mediaLabel;
      category.textContent = card.category;
      cardTitle.textContent = card.title;

      media.append(label);
      cardLink.append(media, category, cardTitle);
      row.append(cardLink);
    });

    group.append(header, row);
    fragment.append(group);
  });

  track.replaceChildren(fragment);
};

const getHorizontalElements = (): HorizontalElements | null => {
  const section = document.querySelector<HTMLElement>("[data-horizontal-section]");
  const track = section?.querySelector<HTMLElement>("[data-horizontal-track]");
  const title = section?.querySelector<HTMLElement>("[data-active-title]");
  const description = section?.querySelector<HTMLElement>("[data-active-description]");
  const link = section?.querySelector<HTMLAnchorElement>("[data-active-link]");

  if (!section || !track || !title || !description || !link) {
    return null;
  }

  if (!track.children.length) {
    renderSections(track);
  }

  const groups = Array.from(track.querySelectorAll<HTMLElement>(".card-group"));

  return { section, track, title, description, link, groups };
};

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

const setupHorizontalScroll = (): void => {
  const elements = getHorizontalElements();

  if (!elements) {
    return;
  }

  const { section, track, title, description, link, groups } = elements;
  const desktopMedia = window.matchMedia(DESKTOP_QUERY);
  let scrollDistance = 0;
  let frameId = 0;

  const setActiveHeader = (x: number): void => {
    let active = groups[0];

    for (const group of groups) {
      if (x >= group.offsetLeft - window.innerWidth * 0.35) {
        active = group;
      }
    }

    if (!active) {
      return;
    }

    title.textContent = active.dataset.title ?? "";
    description.textContent = active.dataset.description ?? "";
    link.href = active.dataset.href ?? "#";
    link.setAttribute("aria-label", active.dataset.linkLabel ?? "더보기");
  };

  const update = (): void => {
    if (frameId) {
      return;
    }

    frameId = window.requestAnimationFrame(() => {
      frameId = 0;

      if (!desktopMedia.matches) {
        track.style.transform = "translate3d(0, 0, 0)";
        return;
      }

      const rect = section.getBoundingClientRect();
      const centerTrigger = window.innerHeight / 2;
      const progress = centerTrigger - rect.top;
      const x = clamp(progress, 0, scrollDistance);

      setActiveHeader(x);
      track.style.transform = `translate3d(${-x}px, 0, 0)`;
    });
  };

  const measure = (): void => {
    scrollDistance = Math.max(0, track.scrollWidth - window.innerWidth);
    section.style.setProperty("--scroll-distance", `${scrollDistance}px`);
    update();
  };

  const resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(track);

  measure();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", measure);
  desktopMedia.addEventListener("change", measure);
};

window.addEventListener("DOMContentLoaded", setupHorizontalScroll);
