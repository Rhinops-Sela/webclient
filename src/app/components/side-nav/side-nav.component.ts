import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { GlobalProviderService } from 'src/app/services/global-provider/global-provider.service';
import { IDomain } from 'src/app/interfaces/IDomain';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';


interface DomainNode {
  displayName: string;
  id: string;
  children?: DomainNode[];
}

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}


@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})

export class SideNavComponent implements OnInit {
  @ViewChild('tree') tree;
  domains: IDomain[];
  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level, node => node.expandable);
  ngOnInit(): void {
    this.loadTree();
  }
  private transformer = (node: DomainNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.displayName,
      level
    };
  }

  // tslint:disable-next-line:member-ordering
  treeFlattener = new MatTreeFlattener(
    this.transformer, node => node.level, node => node.expandable, node => node.children);

  // tslint:disable-next-line:member-ordering
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);


  constructor(private domainService: GlobalProviderService, private router: Router) {
    this.domainService.refreshRequired.subscribe(() => {
      this.loadTree();
    });

  }
  hasChild = (_: number, node: FlatNode) => node.expandable;



  private loadTree() {
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    const domainsTree: DomainNode[] = [];
    this.domainService.getAllDomains().then(result => {
      this.domains = result;
      this.domains.forEach(domain => {
        const pageLeafs: DomainNode[] = [];
        domain.pages.forEach(page => {
          pageLeafs.push({ displayName: page.displayName, id: page.id });
        });
        domainsTree.push({ displayName: domain.displayName, id: domain.id, children: pageLeafs });
      });
      this.dataSource.data = domainsTree;
      this.tree.treeControl.expandAll();
    }).catch((error) => {
      console.log(error);
      this.router.navigate(['']);
    });
  }

  domainSelected(domainDisplayName: string) {
    this.domains.forEach(domain => {
      if (domain.displayName === domainDisplayName) {
        this.domainService.onDomainChange(domain);
        this.router.navigate(['/pages']);
      }
    });
  }

  pageSelected(pageDisplayName: string) {
    this.domains.find((domain) => {
      domain.pages.forEach(page => {
        if (page.displayName === pageDisplayName) {
          this.domainService.onPageChange(page);
          this.domainService.onDomainChange(domain);
          this.router.navigate(['/page']);
        }
      });
    });
  }
}


